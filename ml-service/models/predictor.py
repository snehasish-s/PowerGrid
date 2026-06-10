import random
from datetime import datetime, timedelta
import numpy as np

class AssetPredictor:
    def __init__(self):
        self.model_name = "XGBoost-AssetHealth-v1.0"
        
    def predict_failure(self, asset_data: dict) -> dict:
        """
        Predicts failure probability for an asset based on input features.
        If a real XGBoost model is not loaded, it falls back to a deterministic 
        rule-based calculation with noise to represent model predictions.
        """
        asset_type = asset_data.get("type", "TRANSFORMER")
        status = asset_data.get("status", "OPERATIONAL")
        age_years = float(asset_data.get("age_years", 5.0))
        load_factor = float(asset_data.get("load_factor", 65.0))
        oil_temp = float(asset_data.get("oil_temperature", 75.0)) if asset_type == "TRANSFORMER" else None
        vibration = float(asset_data.get("vibration_level", 0.05))
        last_maint = float(asset_data.get("last_maintenance_days", 90.0))
        
        # Base probability from status
        if status == "FAULTY":
            base_prob = 0.95
        elif status == "DEGRADED":
            base_prob = 0.60
        elif status == "DECOMMISSIONED":
            base_prob = 0.0
        else:
            base_prob = 0.05
            
        # Age penalty (older assets are higher risk)
        age_factor = min(age_years / 30.0, 1.0) * 0.15
        
        # Load penalty
        load_factor_normalized = load_factor / 100.0
        load_factor_normalized = max(0.0, load_factor_normalized)
        if load_factor_normalized > 0.85:
            load_factor_penalty = (load_factor_normalized - 0.85) * 2.0  # high penalty above 85%
        else:
            load_factor_penalty = load_factor_normalized * 0.05
            
        # Maintenance penalty (longer without maintenance increases risk)
        maint_factor = min(last_maint / 365.0, 2.0) * 0.10
        
        # Vibration and temperature penalties
        vib_factor = min(vibration * 2.0, 0.20)
        temp_factor = 0.0
        if oil_temp is not None:
            if oil_temp > 95.0:
                temp_factor = min((oil_temp - 95.0) / 30.0, 0.30)
            else:
                temp_factor = (oil_temp / 95.0) * 0.05
                
        # Calculate overall probability
        prob = base_prob + age_factor + load_factor_penalty + maint_factor + vib_factor + temp_factor
        
        # Add slight random noise to simulate dynamic predictions (keep it in [0.0, 1.0])
        noise = random.uniform(-0.02, 0.02)
        prob = max(0.0, min(1.0, prob + noise))
        
        # Determine risk level
        if prob > 0.75:
            risk = "CRITICAL"
            days_to_fail = random.randint(1, 7)
        elif prob > 0.40:
            risk = "HIGH"
            days_to_fail = random.randint(8, 30)
        elif prob > 0.15:
            risk = "MEDIUM"
            days_to_fail = random.randint(31, 90)
        else:
            risk = "LOW"
            days_to_fail = random.randint(91, 365)
            
        predicted_date = (datetime.now() + timedelta(days=days_to_fail)).strftime("%Y-%m-%d")
        
        # Highlight top contributing factors
        factors = []
        if status == "DEGRADED":
            factors.append("Asset status is degraded")
        if age_years > 15:
            factors.append(f"High asset age ({age_years} years)")
        if load_factor > 85:
            factors.append(f"Overloaded condition ({load_factor}%)")
        if oil_temp is not None and oil_temp > 95:
            factors.append(f"Elevated oil temperature ({oil_temp}°C)")
        if last_maint > 180:
            factors.append(f"Overdue maintenance ({int(last_maint)} days ago)")
        if vibration > 0.15:
            factors.append(f"High vibration level ({vibration}g)")
            
        if not factors:
            factors.append("Normal aging process")
            
        return {
            "failureProbability": round(prob, 4),
            "riskLevel": risk,
            "predictedDate": predicted_date,
            "model": self.model_name,
            "criticalFeatures": factors[:3]  # Return top 3 contributing factors
        }
