from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict
import numpy as np
import pandas as pd
# import lightgbm as lgb # Uncomment when model is trained
# import pickle
import yfinance as yf
from monte_carlo import run_simulation
from cache import cache

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ML Service Operational"}

# --- 1. Data Contract (Strict Schema) ---
class AssetProjectionInput(BaseModel):
    assetClass: Literal["stock", "mutual_fund", "gold", "silver"]
    symbol: str
    investedAmount: float
    peRatio: Optional[float] = 0.0
    eps: Optional[float] = 0.0
    roe: Optional[float] = 0.0
    debtToEquity: Optional[float] = 0.0

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

@app.get("/fundamentals/{symbol}")
def get_fundamentals(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        return {
            "symbol": symbol,
            "peRatio": info.get('trailingPE', 0),
            "eps": info.get('trailingEps', 0),
            "roe": info.get('returnOnEquity', 0),
            "debtToEquity": info.get('debtToEquity', 0)
        }
    except Exception as e:
        print(f"Error fetching fundamentals for {symbol}: {e}")
        return {}

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
        param_key = f"asset:{data.assetClass}:{data.symbol}:params:v3" # Force refresh for new logic
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
                        

                        # --- Fundamental Analysis Adjustment (Phase 8 - Enhanced) ---
                        if data.assetClass == "stock":
                            # 1. Quality Factor (ROE - Return on Equity)
                            # High ROE indicates efficiency -> Boost expected return
                            if data.roe:
                                if data.roe > 0.25:
                                    mu += 0.05  # Massive boost for elite efficiency
                                elif data.roe > 0.15:
                                    mu += 0.03  # Strong boost
                                elif data.roe < 0.05 and data.roe > 0:
                                    mu -= 0.02  # Penalty for inefficiency
                            
                            # 2. Valuation Factor (P/E Ratio)
                            # High P/E -> Higher volatility (growth expectations) but potential drag
                            if data.peRatio:
                                if data.peRatio > 80:
                                    sigma += 0.20 # Extreme volatility risk
                                    mu -= 0.03    # Valuation drag
                                elif data.peRatio > 50:
                                    sigma += 0.10 # High volatility
                                elif data.peRatio < 15 and data.peRatio > 0:
                                    mu += 0.01    # Value premium
                            
                            # 3. Leverage Factor (Debt/Equity)
                            # High Debt -> Higher risk of bankruptcy/distress -> Higher Volatility
                            if data.debtToEquity:
                                if data.debtToEquity > 3.0:
                                    sigma += 0.15 # Extreme leverage risk
                                elif data.debtToEquity > 1.5:
                                    sigma += 0.08 # Moderate leverage risk
                                elif data.debtToEquity < 0.5:
                                    sigma -= 0.02 # Stability bonus
                                
                            # Cap adjustments to stay within sane bounds
                            mu = float(np.clip(mu, -0.05, 0.25))
                            sigma = float(np.clip(sigma, 0.10, 0.60))
                        
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
        simulation_results = {}
        # Fallback for years 1 to 10 (conservative 5% growth)
        for year in range(1, 11):
            factor = (1.05) ** year
            simulation_results[str(year)] = {
                "expectedValue": data.investedAmount*factor,
                "bestCase": data.investedAmount*(factor*1.1),
                "worstCase": data.investedAmount*(factor*0.9)
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
