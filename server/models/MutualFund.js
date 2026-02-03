import mongoose from 'mongoose';

const mutualFundSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: { type: String, required: true, trim: true },
    symbol: { type: String, trim: true, uppercase: true }, // For Live Tracking

    // Live Tracking Mode fields
    quantity: { type: Number },
    purchasePrice: { type: Number }, // Avg NAV
    currentPrice: { type: Number, default: 0 },
    previousClose: { type: Number, default: 0 },

    // SIP Mode fields
    invested: { type: Number, default: 0 }, // Recurring amount
    recurringMonths: { type: Number, default: 1 },
    startDate: { type: Date },
    isCompounded: { type: Boolean, default: false },
    compoundRate: { type: Number },

}, { timestamps: true });

const MutualFund = mongoose.model('MutualFund', mutualFundSchema);
export default MutualFund;
