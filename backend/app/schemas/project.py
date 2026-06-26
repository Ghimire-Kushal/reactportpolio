from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    github_link: Optional[str] = None
    live_url: Optional[str] = None
    tags: Optional[str] = None
    status: str = "draft"
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None

class ProjectOut(ProjectBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
