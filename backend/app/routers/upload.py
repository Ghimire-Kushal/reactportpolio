from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
from app.config import settings
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("")
async def upload_image(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    if not settings.cloudinary_cloud_name:
        raise HTTPException(status_code=503, detail="Cloudinary not configured")

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
    )

    contents = await file.read()
    result = cloudinary.uploader.upload(contents, folder="portfolio")
    return {"url": result["secure_url"]}
