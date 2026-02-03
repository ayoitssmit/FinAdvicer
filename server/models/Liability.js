import mongoose from 'mongoose';

const liabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['loans']
    },
    name: { type: String, required: true },
    cost: { type: Number, required: true }, // Loan Amount
    loanRate: { type: Number, required: true },
    startYear: { type: Number } // Start of loan
}, { timestamps: true });

const Liability = mongoose.model('Liability', liabilitySchema);
export default Liability;
