import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: { type: String, required: true, trim: true },
    purchasePrice: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    growthRate: { type: Number, default: 5 },
    currentValue: { type: Number } // Can be cached or calc on fly
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
export default Property;
