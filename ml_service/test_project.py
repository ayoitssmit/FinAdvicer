import requests
import json

URL = "http://127.0.0.1:8000"

def test_project(symbol):
    print(f"\n--- Testing /project for {symbol} ---")
    payload = {
        "assetClass": "stock",
        "symbol": symbol,
        "investedAmount": 1000
    }
    try:
        resp = requests.post(f"{URL}/project", json=payload)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print(f"Response Keys: {data.keys()}")
            print(f"Has projection data: {bool(data.get('projection'))}")
            print(f"Is Simulated: {data.get('isSimulated')}")
        else:
            print(f"Error Response: {resp.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_project("AAPL")
    test_project("GOOGL")
