import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GPU Intelligence"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "797d6d8a-eb81-48f3-89b1-03436fa4c5e1")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
    ]
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/gpu_intel")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    
    USE_SIMULATOR: bool = os.getenv("USE_SIMULATOR", "true").lower() == "true"
    MONITOR_INTERVAL: int = int(os.getenv("MONITOR_INTERVAL", "5"))

    class Config:
        env_file = ".env"

settings = Settings()
