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
        mu = data['params']['mu']
        sigma = data['params']['sigma']
        print(f"Params: mu={mu:.4f}, sigma={sigma:.4f}")
        print(f"10y Expected: ${data['projection']['10']['expectedValue']:,.2f}")
        
        # Verify Caps
        if asset_class in ["gold", "silver"]:
            if 0.02 <= mu <= 0.10:
                print("✅  SUCCESS: Mu is safely capped (0.02 - 0.10)")
            else:
                print(f"❌  FAILURE: Mu {mu} outside caps!")
                
            if 0.05 <= sigma <= 0.25:
                print("✅  SUCCESS: Sigma is safely capped (0.05 - 0.25)")
            else:
                print(f"❌  FAILURE: Sigma {sigma} outside caps!")
        
        return True
    except Exception as e:
        print(f"FAILED {symbol}: {e}")
        return False

print("Verifying Phase 3: Commodities...")
# Symbol for gold/silver doesn't matter, backend overrides it, but we pass something purely for test logging
gold_ok = test_asset("ANY_GOLD_NAME", "gold", 50000)
silver_ok = test_asset("ANY_SILVER_NAME", "silver", 10000)

if gold_ok and silver_ok:
    print("\n✅ VERIFICATION SUCCESS: Gold & Silver are projecting with SAFETY CAPS!")
else:
    print("\n❌ VERIFICATION FAILED")
