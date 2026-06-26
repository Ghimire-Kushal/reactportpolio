from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.message import Message
from app.models.user import User
from app.schemas.message import ContactCreate, MessageOut
from app.auth import get_current_user
from app.services.email import send_contact_email

router = APIRouter(tags=["messages"])

@router.post("/api/contact", response_model=MessageOut)
async def submit_contact(data: ContactCreate, background: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    msg = Message(**data.model_dump())
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    background.add_task(send_contact_email, data.name, data.email, data.message)
    return msg

@router.get("/api/admin/messages", response_model=List[MessageOut])
async def admin_list(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Message).order_by(Message.created_at.desc()))
    return result.scalars().all()

@router.get("/api/admin/messages/{msg_id}", response_model=MessageOut)
async def admin_show(msg_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Message).where(Message.id == msg_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    if not msg.read_at:
        msg.read_at = datetime.utcnow()
        await db.commit()
        await db.refresh(msg)
    return msg

@router.patch("/api/admin/messages/{msg_id}/read", response_model=MessageOut)
async def mark_read(msg_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Message).where(Message.id == msg_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    msg.read_at = datetime.utcnow()
    await db.commit()
    await db.refresh(msg)
    return msg

@router.patch("/api/admin/messages/{msg_id}/unread", response_model=MessageOut)
async def mark_unread(msg_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Message).where(Message.id == msg_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    msg.read_at = None
    await db.commit()
    await db.refresh(msg)
    return msg

@router.delete("/api/admin/messages/{msg_id}")
async def delete_message(msg_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Message).where(Message.id == msg_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(msg)
    await db.commit()
    return {"message": "deleted"}
