import express from 'express';
import axios from 'axios';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/stocks/:symbol
// @desc    Get real-time quote for a stock symbol
// @access  Private
router.get('/:symbol', auth, async (req, res) => {
    try {
        const { symbol } = req.params;
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Finnhub API key not configured' });
        }

        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`);

        // Finnhub returns { c: current, h: high, l: low, o: open, pc: previous close, ... }
        const data = response.data;

        // Check if Finnhub returned a "0" price, often meaning invalid symbol
        if (data.c === 0 && data.h === 0 && data.l === 0) {
            return res.status(404).json({ error: 'Stock symbol not found or no data available' });
        }

        res.json(data);
    } catch (error) {
        console.error('Stock API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

export default router;
