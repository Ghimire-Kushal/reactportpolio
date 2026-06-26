from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class MessageOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    read_at: Optional[datetime]
    created_at: datetime
    model_config = {"from_attributes": True}
