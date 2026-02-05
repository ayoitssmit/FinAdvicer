
import yfinance as yf
import numpy as np

def validate_model(symbol):
    print(f"\n--- Validating Model Accuracy for {symbol} ---")
    
    # 1. Fetch 10 Years Data
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="10y")
    
    if hist.empty:
        print("Error: Could not fetch data.")
        return

    # 2. Extract Prices
    prices = hist['Close'].values
    print(f"Data Points: {len(prices)} days (approx {len(prices)/252:.1f} years)")
    print(f"Start Price: ${prices[0]:.2f} | Current Price: ${prices[-1]:.2f}")

    # 3. Calculate Parameters (Internal ML Logic)
    returns = np.diff(prices) / prices[:-1]
    
    # Annualize
    sigma = np.std(returns) * np.sqrt(252) # Volatility
    mu = np.mean(returns) * 252            # Annual Return (Drift)

    print("\n--- MODEL PARAMETERS ---")
    print(f"Calculated Annual Drift (Return): {mu*100:.2f}%")
    print(f"Calculated Volatility (Risk):     {sigma*100:.2f}%")
    print("--------------------------")
    
    print("How to judge accuracy:")
    print(f"1. Does {symbol} usually return around {mu*100:.0f}% a year?")
    print(f"2. Is a {sigma*100:.0f}% swing in price normal for {symbol}?")
    print("If yes, the model is accurate to history.")

if __name__ == "__main__":
    validate_model("AAPL")
    validate_model("NKE")
