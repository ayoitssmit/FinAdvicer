import mongoose from 'mongoose';

const commoditySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['gold', 'silver']
    },
    name: { type: String, required: true }, // e.g., "Gold Bar"
    quantity: { type: Number, required: true }, // Weight in oz
    purchasePrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 }
}, { timestamps: true });

const Commodity = mongoose.model('Commodity', commoditySchema);
export default Commodity;
