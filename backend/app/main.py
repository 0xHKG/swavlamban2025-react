"""
FastAPI main application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .core.database import init_db
from .api.auth import router as auth_router
from .api.entries import router as entries_router
from .api.admin import router as admin_router
from .api.passes import router as passes_router

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Registration and Pass Management System for Swavlamban 2025",
    debug=settings.DEBUG
)

# CORS middleware
cors_origins = settings.BACKEND_CORS_ORIGINS.copy() if settings.BACKEND_CORS_ORIGINS else []
print(f"🌐 CORS Origins configured: {cors_origins}")

# For Vercel preview deployments, we need to validate origins dynamically
# since each preview gets a unique URL
def verify_origin(origin: str) -> bool:
    """Verify if origin is allowed"""
    # Check exact matches first
    if origin in cors_origins:
        return True
    # Allow Vercel preview deployments (*.vercel.app)
    if origin and origin.startswith("https://") and origin.endswith(".vercel.app"):
        return True
    return False

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(entries_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(passes_router, prefix=settings.API_V1_PREFIX)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    init_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check(request: Request):
    """Health check endpoint with server IP"""
    import socket

    # Get server IP address
    try:
        # Try to get external IP from request headers (for proxied deployments)
        server_ip = request.headers.get('X-Forwarded-For', '').split(',')[0].strip()
        if not server_ip:
            # Fallback to socket method
            hostname = socket.gethostname()
            server_ip = socket.gethostbyname(hostname)
    except Exception:
        server_ip = "Unable to detect"

    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "server_ip": server_ip
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
