import json
import time
import os
from threading import Lock

CACHE_FILE = "cache_store.json"
CACHE_LOCK = Lock()

class CacheManager:
    def __init__(self):
        self._load_cache()

    def _load_cache(self):
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'r') as f:
                    self.cache = json.load(f)
            except:
                self.cache = {}
        else:
            self.cache = {}

    def _save_cache(self):
        with CACHE_LOCK:
            try:
                with open(CACHE_FILE, 'w') as f:
                    json.dump(self.cache, f)
            except Exception as e:
                print(f"Cache save failed: {e}")

    def get(self, key):
        data = self.cache.get(key)
        if not data:
            return None
        
        # Check TTL
        if time.time() > data['expires_at']:
            del self.cache[key]
            self._save_cache()
            return None
            
        return data['value']

    def set(self, key, value, ttl_seconds):
        self.cache[key] = {
            'value': value,
            'expires_at': time.time() + ttl_seconds
        }
        self._save_cache()

# Global instance
cache = CacheManager()
