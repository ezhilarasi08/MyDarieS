const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verifyCode: { type: String },
  resetCode: { type: String },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  checklist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChecklistItem' }],
  budget: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BudgetEntry' }],
  dictionary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DictionaryEntry' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
