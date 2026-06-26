from pydantic import BaseModel
from typing import Optional, Dict

class SettingOut(BaseModel):
    key: str
    value: Optional[str]
    model_config = {"from_attributes": True}

class SettingsUpdate(BaseModel):
    settings: Dict[str, str]
