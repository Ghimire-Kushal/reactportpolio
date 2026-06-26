from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.database import init_db
from app.routers import auth, projects, messages, settings as settings_router, upload
from app.routers import backup
from app.auth import hash_password

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_admin()
    yield

async def seed_admin():
    from app.database import AsyncSessionLocal
    from app.models.user import User
    from sqlalchemy import select
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        if not result.scalar_one_or_none():
            admin = User(
                name="Kushal Ghimire",
                email="kushal.upr@gmail.com",
                password=hash_password("admin123"),
            )
            db.add(admin)
            await db.commit()

app = FastAPI(title="Portfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(messages.router)
app.include_router(settings_router.router)
app.include_router(upload.router)
app.include_router(backup.router)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/api/health")
async def health():
    return {"status": "ok"}
