from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from models.predictor import AssetPredictor
from utils.data_processor import calculate_system_health_metrics, preprocess_features
import pandas as pd

app = FastAPI(
    title="PowerPulse AI ML Service",
    description="Tata Power Central Odisha Distribution Limited (TPCODL) Smart Utility Asset Intelligence ML Service",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = AssetPredictor()

class AssetFeatureSchema(BaseModel):
    asset_id: str = Field(..., example="TR-1001")
    type: str = Field("TRANSFORMER", example="TRANSFORMER")
    status: str = Field("OPERATIONAL", example="OPERATIONAL")
    age_years: float = Field(5.0, ge=0.0, example=8.5)
    load_factor: float = Field(65.0, ge=0.0, le=150.0, example=78.2)
    oil_temperature: Optional[float] = Field(None, ge=-20.0, le=150.0, example=82.5)
    vibration_level: float = Field(0.05, ge=0.0, le=5.0, example=0.12)
    last_maintenance_days: float = Field(90.0, ge=0.0, example=120.0)

class PredictionResponseSchema(BaseModel):
    asset_id: str
    failureProbability: float
    riskLevel: str
    predictedDate: str
    model: str
    criticalFeatures: List[str]

class BulkPredictionRequest(BaseModel):
    assets: List[AssetFeatureSchema]

class BulkPredictionResponse(BaseModel):
    predictions: List[PredictionResponseSchema]

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ml-service",
        "model_loaded": predictor.model_name
    }

@app.post("/predict", response_model=PredictionResponseSchema)
def predict_asset_failure(asset: AssetFeatureSchema):
    try:
        data = asset.model_dump()
        result = predictor.predict_failure(data)
        result["asset_id"] = asset.asset_id
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/bulk", response_model=BulkPredictionResponse)
def predict_assets_bulk(payload: BulkPredictionRequest):
    try:
        results = []
        for asset in payload.assets:
            data = asset.model_dump()
            result = predictor.predict_failure(data)
            result["asset_id"] = asset.asset_id
            results.append(result)
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/metrics")
def get_aggregated_metrics(assets: List[dict]):
    try:
        metrics = calculate_system_health_metrics(assets)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
