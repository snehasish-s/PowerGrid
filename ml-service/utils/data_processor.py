import pandas as pd
import numpy as np

def preprocess_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans and preprocesses data before inference or training.
    """
    # Fill missing values with reasonable defaults
    if "age_years" in df.columns:
        df["age_years"] = df["age_years"].fillna(5.0)
    if "load_factor" in df.columns:
        df["load_factor"] = df["load_factor"].fillna(60.0)
    if "vibration_level" in df.columns:
        df["vibration_level"] = df["vibration_level"].fillna(0.05)
    if "last_maintenance_days" in df.columns:
        df["last_maintenance_days"] = df["last_maintenance_days"].fillna(90.0)
        
    return df

def calculate_system_health_metrics(assets_list: list) -> dict:
    """
    Aggregates asset health statistics from a list of asset dicts.
    """
    if not assets_list:
        return {
            "average_health_score": 100.0,
            "assets_degraded": 0,
            "assets_operational": 0,
            "assets_critical": 0
        }
        
    df = pd.DataFrame(assets_list)
    
    # Calculate health score based on status
    status_weights = {
        "OPERATIONAL": 100.0,
        "DEGRADED": 60.0,
        "FAULTY": 20.0,
        "DECOMMISSIONED": 0.0
    }
    
    df["health_score"] = df["status"].map(status_weights).fillna(100.0)
    
    return {
        "average_health_score": round(df["health_score"].mean(), 2),
        "assets_degraded": int((df["status"] == "DEGRADED").sum()),
        "assets_operational": int((df["status"] == "OPERATIONAL").sum()),
        "assets_critical": int((df["status"] == "FAULTY").sum()),
        "total_count": len(df)
    }
