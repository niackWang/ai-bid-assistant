"""
AI Bid Assistant - Backend Server

FastAPI 服务入口
启动: python main.py
API 文档: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="AI 标书助手 — 多智能体协同标书编制平台",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/api/v1/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )