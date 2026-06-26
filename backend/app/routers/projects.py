from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import re
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)

async def unique_slug(db: AsyncSession, base: str, exclude_id: Optional[int] = None) -> str:
    slug = slugify(base)
    candidate = slug
    i = 1
    while True:
        q = select(Project).where(Project.slug == candidate)
        if exclude_id:
            q = q.where(Project.id != exclude_id)
        result = await db.execute(q)
        if not result.scalar_one_or_none():
            return candidate
        candidate = f"{slug}-{i}"
        i += 1

@router.get("", response_model=List[ProjectOut])
async def list_projects(
    featured: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    q = select(Project).order_by(Project.created_at.desc())
    if featured is not None:
        q = q.where(Project.featured == featured)
    result = await db.execute(q)
    return result.scalars().all()

@router.get("/{slug}", response_model=ProjectOut)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.slug == slug))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # related: 3 latest excluding this one
    related_result = await db.execute(
        select(Project).where(Project.id != project.id).order_by(Project.created_at.desc()).limit(3)
    )
    project._related = related_result.scalars().all()
    return project

# Admin endpoints
@router.get("/admin/all", response_model=List[ProjectOut])
async def admin_list(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    return result.scalars().all()

@router.post("/admin", response_model=ProjectOut)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    slug = await unique_slug(db, data.title)
    project = Project(**data.model_dump(), slug=slug)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.put("/admin/{project_id}", response_model=ProjectOut)
async def update_project(project_id: int, data: ProjectUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(project, k, v)
    if data.title:
        project.slug = await unique_slug(db, data.title, exclude_id=project_id)
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/admin/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(project)
    await db.commit()
    return {"message": "deleted"}
