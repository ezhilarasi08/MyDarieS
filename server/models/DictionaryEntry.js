const mongoose = require('mongoose');

const DictionaryEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  term: { type: String, required: true },
  definition: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DictionaryEntry', DictionaryEntrySchema);
