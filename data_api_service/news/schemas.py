from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import datetime

class NewsBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: HttpUrl
    source: str
    image: Optional[HttpUrl] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(NewsBase):
    pass

class NewsInDBBase(NewsBase):
    id: str
    published_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class News(NewsInDBBase):
    pass

class NewsInDB(NewsInDBBase):
    pass
