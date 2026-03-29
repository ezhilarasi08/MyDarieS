const mongoose = require('mongoose');

const BudgetEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BudgetEntry', BudgetEntrySchema);
