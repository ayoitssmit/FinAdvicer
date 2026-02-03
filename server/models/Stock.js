import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: { type: String, required: true, trim: true },
    symbol: { type: String, trim: true, uppercase: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    previousClose: { type: Number, default: 0 }
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
