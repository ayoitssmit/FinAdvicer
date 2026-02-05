
import sys
import os

# Ensure we can import monte_carlo
sys.path.append(os.getcwd())

import yfinance as yf
import numpy as np
try:
    from monte_carlo import run_simulation
except ImportError:
    print("Could not import monte_carlo. Make sure you run this from ml_service logic.")
    sys.exit(1)

def test_logic():
    symbol = "NKE"
    print(f"--- Testing {symbol} ---")
    
    try:
        print("1. Initializing Ticker...")
        ticker = yf.Ticker(symbol)
        
        print("2. Downloading History (10y)...")
        hist = ticker.history(period="10y")
        print(f"   History downloaded. Shape: {hist.shape}")
        
        if hist.empty:
            print("   WARNING: History is empty!")
            return

        prices = hist['Close'].values
        print(f"   Prices sample: {prices[:5]}")
        
        print("3. Calculating Metrics...")
        returns = np.diff(prices) / prices[:-1]
        sigma = np.std(returns) * np.sqrt(252)
        mu = np.mean(returns) * 252
        print(f"   Mu: {mu}, Sigma: {sigma}")
        
        print("4. Running Simulation...")
        sim = run_simulation(10000.0, float(mu), float(sigma), [3, 5, 10], 10000)
        print("   Simulation Result keys:", sim.keys())
        print("--- SUCCESS ---")

    except Exception as e:
        print("\n!!! EXCEPTION CAUGHT !!!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_logic()
