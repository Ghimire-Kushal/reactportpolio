from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import cloudinary
import cloudinary.uploader
import aiofiles
import os, uuid, mimetypes
from app.config import settings
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")

async def _save_local(file: UploadFile, subfolder: str = "") -> str:
    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest_dir = os.path.join(UPLOAD_DIR, subfolder) if subfolder else UPLOAD_DIR
    os.makedirs(dest_dir, exist_ok=True)
    path = os.path.join(dest_dir, filename)
    contents = await file.read()
    async with aiofiles.open(path, "wb") as f:
        await f.write(contents)
    return f"/uploads/{subfolder + '/' if subfolder else ''}{filename}"

@router.post("")
async def upload_image(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    if settings.cloudinary_cloud_name:
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
        )
        contents = await file.read()
        result = cloudinary.uploader.upload(contents, folder="portfolio")
        return {"url": result["secure_url"]}
    url = await _save_local(file, "images")
    return {"url": url}

@router.post("/resume")
async def upload_resume(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    # Always save resume as resume.pdf locally
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, "resume.pdf")
    contents = await file.read()
    async with aiofiles.open(path, "wb") as f:
        await f.write(contents)
    return {"url": "/uploads/resume.pdf"}

@router.get("/resume/download")
async def download_resume():
    path = os.path.join(UPLOAD_DIR, "resume.pdf")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Resume not uploaded yet")
    return FileResponse(path, media_type="application/pdf", filename="resume.pdf")
