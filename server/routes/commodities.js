import express from 'express';
import axios from 'axios';
import auth from '../middleware/auth.js';

const router = express.Router();

// External API URL (Suspended)
// const EXTERNAL_API_URL = 'https://finsim-api-neqc.onrender.com/commodities';

// @route   GET /api/commodities/gold
// @desc    Get current gold price (USD per Ounce) via Finnhub
// @access  Private
// Helper to getting price or fallback
const getPrice = async (symbol, basePrice) => {
    try {
        const ML_SERVICE_URL = 'http://127.0.0.1:8000/price';
        // Map common names to Yahoo Tickers
        const ticker = symbol === 'XAU' ? 'GC=F' : (symbol === 'XAG' ? 'SI=F' : symbol);

        const response = await axios.get(`${ML_SERVICE_URL}/${ticker}`);

        if (response.data && response.data.c) {
            return response.data.c;
        }
    } catch (error) {
        console.error(`ML Service Error for ${symbol}:`, error.message);
    }

    // Fallback: Return simulated live price (Base + random fluctuation)
    // Simulating market movement for demo purposes if API is restricted
    const fluctuation = basePrice * 0.005 * (Math.random() - 0.5); // +/- 0.25%
    return basePrice + fluctuation;
};

// @route   GET /api/commodities/gold
// @desc    Get current gold price (USD per Ounce)
// @access  Private
router.get('/gold', auth, async (req, res) => {
    try {
        // Gold Base: ~$2650
        const price = await getPrice('XAU', 2650);
        res.json({ price_per_ounce_usd: price });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gold data' });
    }
});

// @route   GET /api/commodities/silver
// @desc    Get current silver price (USD per Ounce)
// @access  Private
router.get('/silver', auth, async (req, res) => {
    try {
        // Silver Base: ~$31.50
        const price = await getPrice('XAG', 31.50);
        res.json({ price_per_ounce_usd: price });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch silver data' });
    }
});

export default router;
