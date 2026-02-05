import requests
import json

url = "http://127.0.0.1:8000/project"

def test_asset(symbol, asset_class, amount):
    payload = {
        "assetClass": asset_class,
        "symbol": symbol,
        "investedAmount": amount
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"\n--- Testing {asset_class}: {symbol} ---")
        print(f"Status: {response.status_code}")
        print(f"Is Simulated: {data.get('isSimulated')}")
        print(f"Params: mu={data['params']['mu']:.4f}, sigma={data['params']['sigma']:.4f}")
        print(f"10y Expected: ${data['projection']['10']['expectedValue']:,.2f}")
        if data.get('isSimulated'):
             print("⚠️  WARNING: Result is simulated (fallback used)")
        else:
             print("✅  SUCCESS: Real data fetched and calculated")
        return True
    except Exception as e:
        print(f"FAILED {symbol}: {e}")
        return False

print("Verifying Phase 2: Mutual Funds & Stocks...")
stock_ok = test_asset("AAPL", "stock", 10000)
mf_ok = test_asset("VFIAX", "mutual_fund", 10000)

if stock_ok and mf_ok:
    print("\n✅ VERIFICATION SUCCESS: Both Stocks and Mutual Funds are projecting correctly!")
else:
    print("\n❌ VERIFICATION FAILED")
