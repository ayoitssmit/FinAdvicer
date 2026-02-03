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
    cost: { type: Number, required: true } // Monthly or Yearly cost
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
