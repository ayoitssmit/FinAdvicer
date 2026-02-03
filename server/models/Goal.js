import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['marriage', 'education', 'postRetirement']
    },
    name: { type: String, required: true },
    amount: { type: Number }, // Target Amount (for retirement) or Cost
    cost: { type: Number }, // Current Cost (for marriage/edu)
    startYear: { type: Number }, // Expected year
    years: { type: Number } // Duration if applicable
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
