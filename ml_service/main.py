from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
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

# --- 1. Data Contract (Updated for Phase 2) ---
class AssetProjectionInput(BaseModel):
    assetClass: str  
    symbol: str # Symbol is now mandatory for fetching
    investedAmount: float
    # recentPrices: List[float] # REMOVED: We fetch this internally now

class FullProjectionInput(AssetProjectionInput):
    pass

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

@app.post("/project")
def project_asset(data: FullProjectionInput):
    # Default Safe Values (Fallback)
    mu, sigma = 0.06, 0.10 
    is_simulated = False
    simulation_results = {}

    try:
        # 1. Fetch Data (if stock)
        if data.assetClass == "stock":
            try:
                ticker = yf.Ticker(data.symbol)
                # Fetch 10y history
                hist = ticker.history(period="10y")
                
                if not hist.empty:
                    prices = hist['Close'].values
                    # Feature Engineering
                    returns = np.diff(prices) / prices[:-1]
                    if len(returns) > 0:
                        sigma = float(np.std(returns) * np.sqrt(252))
                        mu = float(np.mean(returns) * 252)
                    else:
                        print(f"Warning: Not enough return data for {data.symbol}")
                        is_simulated = True
                else:
                    print(f"Warning: No data found for {data.symbol}")
                    is_simulated = True
                    
            except Exception as e:
                print(f"Error fetching yfinance data for {data.symbol}: {e}")
                is_simulated = True

        # 2. Run Monte Carlo (with calculated or default params)
        simulation_results = run_simulation(
            initial_investment=data.investedAmount,
            expected_return=mu,
            volatility=sigma,
            years_list=[3, 5, 10]
        )
    
    except Exception as e:
        print(f"CRITICAL ERROR in project endpoint: {e}")
        # Absolute last resort fallback
        is_simulated = True
        # Simple single-point fallback if run_simulation failed
        simulation_results = {
            3: {"expectedValue": data.investedAmount * 1.18, "bestCase": data.investedAmount * 1.3, "worstCase": data.investedAmount * 1.0},
            5: {"expectedValue": data.investedAmount * 1.33, "bestCase": data.investedAmount * 1.5, "worstCase": data.investedAmount * 1.1},
            10: {"expectedValue": data.investedAmount * 1.79, "bestCase": data.investedAmount * 2.0, "worstCase": data.investedAmount * 1.2}
        }

    
    # Sanitize all float values to prevent NaN JSON serialization errors
    def safe_float(val, default=0.0):
        try:
            if np.isnan(val) or np.isinf(val):
                return default
            return float(val)
        except:
            return default
    
    # Sanitize mu and sigma
    mu = safe_float(mu, 0.06)
    sigma = safe_float(sigma, 0.10)
    
    # Sanitize all projection results
    sanitized_results = {}
    for year, values in simulation_results.items():
        sanitized_results[year] = {
            "expectedValue": safe_float(values.get("expectedValue", 0)),
            "bestCase": safe_float(values.get("bestCase", 0)),
            "worstCase": safe_float(values.get("worstCase", 0))
        }
    
    return {
        "params": {"mu": mu, "sigma": sigma},
        "projection": sanitized_results,
        "isSimulated": is_simulated
    }
