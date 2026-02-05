import express from 'express';
import verifyToken from '../middleware/auth.js';

// Import all new models
import Stock from '../models/Stock.js';
import MutualFund from '../models/MutualFund.js';
import Property from '../models/Property.js';
import FixedDeposit from '../models/FixedDeposit.js';
import Commodity from '../models/Commodity.js';
import Goal from '../models/Goal.js';
import Liability from '../models/Liability.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// Helper to get Model by Type string
const getModelByType = (type) => {
    switch (type) {
        case 'stocks': return Stock;
        case 'mutualFunds': return MutualFund;
        case 'properties': return Property;
        case 'fd': return FixedDeposit;
        case 'gold':
        case 'silver': return Commodity;
        case 'marriage':
        case 'education':
        case 'postRetirement': return Goal;
        case 'loans': return Liability;
        case 'bills':
        case 'personalExpense':
        case 'insurance': return Expense;
        default: return null;
    }
};

// @route   GET /api/financial
// @desc    Get all financial items (aggregated from all collections)
// @access  Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch from all collections in parallel
        const [
            stocks, mutualFunds, properties, fds,
            commodities, goals, liabilities, expenses
        ] = await Promise.all([
            Stock.find({ user: userId }).lean(),
            MutualFund.find({ user: userId }).lean(),
            Property.find({ user: userId }).lean(),
            FixedDeposit.find({ user: userId }).lean(),
            Commodity.find({ user: userId }).lean(),
            Goal.find({ user: userId }).lean(),
            Liability.find({ user: userId }).lean(),
            Expense.find({ user: userId }).lean()
        ]);

        // Helper to formatting (id instead of _id)
        const format = (items, typeOverride) => items.map(item => {
            const { _id, ...rest } = item;
            return { id: _id, type: typeOverride || item.type, ...rest };
        });

        // Construct the response object matching existing frontend structure
        const responseData = {
            stocks: format(stocks, 'stocks'),
            mutualFunds: format(mutualFunds, 'mutualFunds'),
            properties: format(properties, 'properties'),
            fd: format(fds, 'fd'),
            // Group specific types
            gold: format(commodities.filter(c => c.type === 'gold'), 'gold'),
            silver: format(commodities.filter(c => c.type === 'silver'), 'silver'),

            marriage: format(goals.filter(g => g.type === 'marriage'), 'marriage'),
            education: format(goals.filter(g => g.type === 'education'), 'education'),
            postRetirement: format(goals.filter(g => g.type === 'postRetirement'), 'postRetirement'),

            loans: format(liabilities, 'loans'),

            bills: format(expenses.filter(e => e.type === 'bills'), 'bills'),
            personalExpense: format(expenses.filter(e => e.type === 'personalExpense'), 'personalExpense'),
            insurance: format(expenses.filter(e => e.type === 'insurance'), 'insurance'),
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/financial
// @desc    Add a new financial item
// @access  Private
router.post('/', verifyToken, async (req, res) => {
    try {
        const { type, ...itemData } = req.body;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ error: 'Invalid Item Type' });
        }

        const newItem = new Model({
            user: req.userId,
            type, // Some models use this (Commodity, Goal, Expense), others ignore it
            ...itemData
        });

        const savedItem = await newItem.save();
        const { _id, __v, ...rest } = savedItem.toObject();

        // Return with 'id' and correct structure
        res.status(201).json({ id: _id, type, ...rest });

    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// @route   PUT /api/financial/:id
// @desc    Update a financial item
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, ...updates } = req.body;

        // We need 'type' to know which collection to update
        if (!type) {
            return res.status(400).json({ error: 'Type is required for update' });
        }

        const Model = getModelByType(type);
        if (!Model) {
            return res.status(400).json({ error: 'Invalid Item Type' });
        }

        const updatedItem = await Model.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const { _id, __v, ...rest } = updatedItem;
        res.json({ id: _id, type, ...rest });

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/financial/:id
// @desc    Delete a financial item
// @access  Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const type = req.query.type; // Expect type in query param

        let deletedItem = null;

        if (type) {
            const Model = getModelByType(type);
            if (Model) {
                deletedItem = await Model.findOneAndDelete({ _id: id, user: req.userId });
            }
        } else {
            // Fallback: Try deleting from ALL collections (Not efficient but safe if type is missing)
            const models = [Stock, MutualFund, Property, FixedDeposit, Commodity, Goal, Liability, Expense];
            for (const Model of models) {
                deletedItem = await Model.findOneAndDelete({ _id: id, user: req.userId });
                if (deletedItem) break;
            }
        }

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully', id });

    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

import axios from 'axios';

// Helper to fetch/simulate historical prices (REMOVED: Now handled by ML Service)
/* 
    Historical fetching has been moved to Python ML Service using yfinance.
    This keeps the Node backend lighter and uses a free, robust data source.
*/

// @route   POST /api/financial/projection
// @desc    Get ML-based projections for stocks
// @access  Private
router.post('/projection', verifyToken, async (req, res) => {
    try {
        // 1. Get user stocks, mutual funds AND commodities
        const [stocks, mutualFunds, commodities] = await Promise.all([
            Stock.find({ user: req.userId }).lean(),
            MutualFund.find({ user: req.userId }).lean(),
            Commodity.find({ user: req.userId }).lean()
        ]);

        if (!stocks.length && !mutualFunds.length && !commodities.length) {
            return res.json({ projections: [] });
        }

        const projections = [];
        const ML_SERVICE_URL = 'http://127.0.0.1:8000/project';

        // Helper to Validate Contract (Phase 0 Guardrail)
        const validateMLRequest = (payload) => {
            const validAssets = ["stock", "mutual_fund", "gold", "silver"];
            if (!validAssets.includes(payload.assetClass)) throw new Error(`Invalid assetClass: ${payload.assetClass}`);
            if (typeof payload.symbol !== 'string' || !payload.symbol) throw new Error("Invalid symbol");
            if (typeof payload.investedAmount !== 'number') throw new Error("Invalid investedAmount");
        };

        // Combine for processing (Map Commodity type 'gold'/'silver' to assetClass)
        const allAssets = [
            ...stocks.map(s => ({ ...s, assetClass: 'stock' })),
            ...mutualFunds.map(mf => ({ ...mf, assetClass: 'mutual_fund' })),
            ...commodities.map(c => ({ ...c, assetClass: c.type, symbol: c.type.toUpperCase() })) // Gold/Silver use type as symbol placeholder
        ];

        // 2. Process each asset
        for (const asset of allAssets) {
            const symbol = asset.symbol || asset.name; // Fallback

            // 3. Call ML Service directly (History fetched by Python now)
            try {
                const mlPayload = {
                    assetClass: asset.assetClass,
                    symbol: symbol,
                    investedAmount: asset.quantity * asset.purchasePrice, // Assuming MFs also have quantity/price or total invested
                };

                // Guardrail: Validate Contract
                validateMLRequest(mlPayload);

                const mlResponse = await axios.post(ML_SERVICE_URL, mlPayload);

                projections.push({
                    symbol,
                    assetClass: asset.assetClass,
                    ...mlResponse.data.projection,
                    params: mlResponse.data.params,
                    isSimulated: mlResponse.data.isSimulated
                });

            } catch (err) {
                console.error(`ML Service failed for ${symbol}:`, err.message);

                // Fallback if ML service is down (Step 4.3: Always return valid shape)
                // We return a conservative defaults so the UI graph doesn't crash
                const invest = asset.quantity * asset.purchasePrice || 0;

                // create a map of 1-10 years
                const projectionMap = {};
                for (let i = 1; i <= 10; i++) {
                    // Simple linear growth assumption for fallback (8% per year)
                    const fallbackRate = 1.08;
                    const val = invest * Math.pow(fallbackRate, i);
                    projectionMap[i.toString()] = {
                        expectedValue: val,
                        bestCase: val * 1.1,
                        worstCase: val * 0.95
                    };
                }

                projections.push({
                    symbol,
                    assetClass: asset.assetClass,
                    error: "ML Service Unavailable",
                    isSimulated: true,
                    params: { mu: 0.05, sigma: 0.10 }, // Safe default params
                    ...projectionMap // Spread the 1-10 keys
                });
            }
        }

        res.json({ projections });

    } catch (error) {
        console.error('Error generating projection:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
