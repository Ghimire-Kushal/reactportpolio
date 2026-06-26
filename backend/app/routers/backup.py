from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
from datetime import datetime
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.auth import get_current_user
from app.routers.projects import unique_slug

router = APIRouter(prefix="/api/backup", tags=["backup"])

@router.get("/export")
async def export_all(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()
    data = {
        "version": "1.0",
        "exported_at": datetime.utcnow().isoformat(),
        "count": len(projects),
        "projects": [
            {
                "title": p.title, "slug": p.slug, "description": p.description,
                "body": p.body, "image_url": p.image_url, "github_link": p.github_link,
                "live_url": p.live_url, "tags": p.tags, "status": p.status, "featured": p.featured,
            }
            for p in projects
        ],
    }
    return JSONResponse(content=data, headers={"Content-Disposition": "attachment; filename=portfolio-backup.json"})

@router.get("/export/{project_id}")
async def export_one(project_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    data = {
        "version": "1.0",
        "exported_at": datetime.utcnow().isoformat(),
        "count": 1,
        "projects": [{"title": p.title, "slug": p.slug, "description": p.description,
                       "body": p.body, "image_url": p.image_url, "github_link": p.github_link,
                       "live_url": p.live_url, "tags": p.tags, "status": p.status, "featured": p.featured}],
    }
    return JSONResponse(content=data, headers={"Content-Disposition": f"attachment; filename={p.slug}-backup.json"})

@router.post("/import")
async def import_projects(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    contents = await file.read()
    try:
        data = json.loads(contents)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")

    imported, skipped, errors = 0, 0, []
    for item in data.get("projects", []):
        if not item.get("title") or not item.get("description"):
            errors.append(f"Skipped: missing title or description")
            skipped += 1
            continue
        existing = await db.execute(select(Project).where(Project.title == item["title"]))
        if existing.scalar_one_or_none():
            skipped += 1
            continue
        slug = await unique_slug(db, item["title"])
        # Support both field names from live site export (image/link) and local schema (image_url/live_url)
        db.add(Project(
            title=item["title"], slug=slug, description=item.get("description"),
            body=item.get("body"),
            image_url=item.get("image_url") or item.get("image"),
            github_link=item.get("github_link"),
            live_url=item.get("live_url") or item.get("link"),
            tags=item.get("tags"), status=item.get("status", "completed"),
            featured=item.get("featured", False),
        ))
        imported += 1
    await db.commit()
    return {"imported": imported, "skipped": skipped, "errors": errors}
