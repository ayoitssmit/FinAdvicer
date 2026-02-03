import mongoose from 'mongoose';

const fdSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: { type: String, required: true, trim: true }, // Bank Name etc
    principal: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    years: { type: Number, required: true },
    maturityDate: { type: Date } // Optional, can be derived
}, { timestamps: true });

const FixedDeposit = mongoose.model('FixedDeposit', fdSchema);
export default FixedDeposit;
