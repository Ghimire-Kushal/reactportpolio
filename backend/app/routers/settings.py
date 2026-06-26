from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict
from app.database import get_db
from app.models.setting import Setting
from app.models.user import User
from app.schemas.setting import SettingOut, SettingsUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

DEFAULT_KEYS = ["site_name", "bio", "tagline", "github_url", "linkedin_url", "twitter_url", "email", "available_for_work"]

@router.get("", response_model=Dict[str, str])
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting))
    return {s.key: s.value or "" for s in result.scalars().all()}

@router.post("")
async def update_settings(data: SettingsUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    for key, value in data.settings.items():
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = value
        else:
            db.add(Setting(key=key, value=value))
    await db.commit()
    return {"message": "updated"}
