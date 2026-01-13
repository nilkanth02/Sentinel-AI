from fastapi import FastAPI
from app.api.routes import router
from app.api.baseline_routes import router as baseline_router
from app.storage.db import init_db

app = FastAPI(title="Sentinel AI API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    init_db()

# Include the analysis router
app.include_router(router, prefix="/api")

# Include the baseline management router
app.include_router(baseline_router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)