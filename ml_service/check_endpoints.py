import requests
import json

URL = "http://127.0.0.1:8000"

def test_price(symbol):
    print(f"\n--- Testing /price/{symbol} ---")
    try:
        resp = requests.get(f"{URL}/price/{symbol}")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Request failed: {e}")

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
        # print(f"Response: {resp.text[:200]}...") # Truncate for brevity
        print(f"Response Keys: {resp.json().keys() if resp.status_code == 200 else 'Error'}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_price("AAPL")
    test_project("AAPL")
    test_price("INVALID_SYM_123")
