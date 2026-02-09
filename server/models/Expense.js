import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['bills', 'personalExpense', 'insurance']
    },
    name: { type: String, required: true },
    cost: { type: Number, required: true }, // Monthly or Yearly cost

    // New Fields for Insurance Logic
    startYear: { type: Number },
    policyTerm: { type: Number }, // Years to pay
    inflationRate: { type: Number, default: 0 }, // 0 for Term, 7 for Health
    category: { type: String, enum: ['Health', 'Term', 'ULIP', 'General'], default: 'General' }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
