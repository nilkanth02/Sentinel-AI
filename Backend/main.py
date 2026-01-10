from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentinel AI API", version="1.0.0")


class AnalyzeRequest(BaseModel):
    data: dict


@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "healthy", "message": "API is operational"}


@app.post("/analyze")
async def analyze_data(request: AnalyzeRequest):
    """Placeholder endpoint for data analysis."""
    return {
        "status": "pending",
        "message": "Analysis endpoint placeholder - implementation needed",
        "received_data": request.data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)