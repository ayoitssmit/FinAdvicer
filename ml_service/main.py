from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict
import numpy as np
import pandas as pd
# import lightgbm as lgb # Uncomment when model is trained
# import pickle
import yfinance as yf
from monte_carlo import run_simulation

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ML Service Operational"}

# --- 1. Data Contract (Step 1) ---

# ... (Previous code)

# --- 1. Data Contract (Strict Schema) ---
class AssetProjectionInput(BaseModel):
    assetClass: Literal["stock", "mutual_fund", "gold", "silver"]
    symbol: str
    investedAmount: float

class ProjectionMetrics(BaseModel):
    expectedValue: float
    bestCase: float
    worstCase: float

class FullProjectionResponse(BaseModel):
    params: dict
    projection: Dict[str, ProjectionMetrics]
    isSimulated: bool

@app.get("/price/{symbol}")
def get_price(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        
        # Use history(period="10y") to match the training model's consistency
        # This ensures we are "crash proof" using the long-term dataset availability
        hist = ticker.history(period="10y")
        
        if not hist.empty:
            current_price = hist['Close'].iloc[-1]
            # Use previous closing price
            if len(hist) > 1:
                prev_close = hist['Close'].iloc[-2]
            else:
                prev_close = current_price # Default to same if no history
            
            # Sanitize outputs to prevent JSON serialization errors (NaN -> 0.0 or valid float)
            def safe_float(val):
                return float(val) if not np.isnan(val) else 0.0

            return {
                "symbol": symbol,
                "c": safe_float(current_price),
                "pc": safe_float(prev_close)
            }
        else:
            raise ValueError("Empty history")
            
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        # Return 404 so backend handles fallback
        raise HTTPException(status_code=404, detail="Price not found")

from cache import cache

# ... (Imports)

@app.post("/project", response_model=FullProjectionResponse)
def project_asset(data: AssetProjectionInput):
    # --- 1. Canonical Commodity Mapping (Phase 3) ---
    COMMODITY_MAP = {
        "gold": "GC=F",
        "silver": "SI=F"
    }
    
    # Force override ticker if asset is a commodity
    if data.assetClass in COMMODITY_MAP:
        data.symbol = COMMODITY_MAP[data.assetClass]

    # 1. Check Projection Cache (Fastest Path)
    # Key: projection:stock:{symbol}:{amount}
    CACHE_VERSION = "v2" # Increment to invalidate old caches (Phase 4 fix)
    proj_key = f"{CACHE_VERSION}:projection:{data.assetClass}:{data.symbol}:{data.investedAmount}"
    cached_projection = cache.get(proj_key)
    
    if cached_projection:
        return cached_projection

    # Default Safe Values
    mu, sigma = 0.06, 0.10 
    is_simulated = False
    simulation_results = {}

    try:
        # 2. Check Parameter Cache (Avoid yfinance)
        # Key: asset:stock:{symbol}:params
        param_key = f"asset:{data.assetClass}:{data.symbol}:params"
        cached_params = cache.get(param_key)
        
        fetched_params = False

        if cached_params:
            mu = cached_params['mu']
            sigma = cached_params['sigma']
            fetched_params = True
        
        # 3. Fetch Data if needed (and valid asset class)
        if not fetched_params and data.assetClass in ["stock", "mutual_fund", "gold", "silver"]:
            try:
                ticker = yf.Ticker(data.symbol)
                hist = ticker.history(period="10y")
                
                if not hist.empty:
                    prices = hist['Close'].values
                    returns = np.diff(prices) / prices[:-1]
                    if len(returns) > 0:
                        sigma = float(np.std(returns) * np.sqrt(252))
                        mu = float(np.mean(returns) * 252)
                        
                        # --- Financial Safety Caps (Phase 3) ---
                        # Prevent macro assets from having unrealistic growth or volatility
                        if data.assetClass in ["gold", "silver"]:
                            mu = float(np.clip(mu, 0.02, 0.10))      # Max 10% growth
                            sigma = float(np.clip(sigma, 0.05, 0.25)) # Max 25% volatility
                        
                        # Cache Parameters (7 Days)
                        cache.set(param_key, {"mu": mu, "sigma": sigma}, 7 * 24 * 60 * 60)
                    else:
                        print(f"Warning: Not enough return data for {data.symbol}")
                        is_simulated = True
                else:
                    print(f"Warning: No data found for {data.symbol}")
                    is_simulated = True
                    
            except Exception as e:
                print(f"Error fetching yfinance data for {data.symbol}: {e}")
                is_simulated = True

        # 4. Run Monte Carlo
        simulation_results = run_simulation(
            initial_investment=data.investedAmount,
            expected_return=mu,
            volatility=sigma,
            years_list=list(range(1, 11)) # Return all years 1-10 for smooth graphs
        )
    
    except Exception as e:
        print(f"CRITICAL ERROR in project endpoint: {e}")
        is_simulated = True
        simulation_results = {
            "3": {"expectedValue": data.investedAmount * 1.18, "bestCase": data.investedAmount * 1.3, "worstCase": data.investedAmount * 1.0},
            "5": {"expectedValue": data.investedAmount * 1.33, "bestCase": data.investedAmount * 1.5, "worstCase": data.investedAmount * 1.1},
            "10": {"expectedValue": data.investedAmount * 1.79, "bestCase": data.investedAmount * 2.0, "worstCase": data.investedAmount * 1.2}
        }

    # Sanitize inputs (as before)
    def safe_float(val, default=0.0):
        try:
            if np.isnan(val) or np.isinf(val):
                return default
            return float(val)
        except:
            return default
    
    mu = safe_float(mu, 0.06)
    sigma = safe_float(sigma, 0.10)
    
    sanitized_results = {}
    for year, values in simulation_results.items():
        # Ensure year key is string for Pydantic/JSON
        year_key = str(year)
        sanitized_results[year_key] = {
            "expectedValue": safe_float(values.get("expectedValue", 0)),
            "bestCase": safe_float(values.get("bestCase", 0)),
            "worstCase": safe_float(values.get("worstCase", 0))
        }
    
    final_response = {
        "params": {"mu": mu, "sigma": sigma},
        "projection": sanitized_results,
        "isSimulated": is_simulated
    }
    
    # Cache Result (24 Hours)
    cache.set(proj_key, final_response, 24 * 60 * 60)
    
    return final_response
