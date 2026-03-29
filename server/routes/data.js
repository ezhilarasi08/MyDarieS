const express = require('express');
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const ChecklistItem = require('../models/ChecklistItem');
const BudgetEntry = require('../models/BudgetEntry');
const DictionaryEntry = require('../models/DictionaryEntry');

const router = express.Router();

router.use(auth);

router.get('/profile', async (req, res) => {
  const user = await require('../models/User').findById(req.user.id).select('firstName lastName email verified');
  res.json(user);
});

// Note routes
router.get('/notes', async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});
router.post('/notes', async (req, res) => {
  const note = await Note.create({ user: req.user.id, text: req.body.text });
  res.json(note);
});
router.delete('/notes/:id', async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'deleted' });
});

// Checklist
router.get('/checklist', async (req, res) => {
  const items = await ChecklistItem.find({ user: req.user.id });
  res.json(items);
});
router.post('/checklist', async (req, res) => {
  const item = await ChecklistItem.create({ user: req.user.id, task: req.body.task });
  res.json(item);
});
router.put('/checklist/:id/toggle', async (req, res) => {
  const item = await ChecklistItem.findOne({ _id: req.params.id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.done = !item.done; await item.save();
  res.json(item);
});
router.delete('/checklist/:id', async (req, res) => {
  await ChecklistItem.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'deleted' });
});


// Budget
router.get('/budget', async (req, res) => {
  const entries = await BudgetEntry.find({ user: req.user.id });
  res.json(entries);
});
router.post('/budget', async (req, res) => {
  const { description, amount, type } = req.body;
  const entry = await BudgetEntry.create({ user: req.user.id, description, amount, type });
  res.json(entry);
});
router.delete('/budget/:id', async (req, res) => {
  await BudgetEntry.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'deleted' });
});

// Dictionary
router.get('/dictionary', async (req, res) => {
  const entries = await DictionaryEntry.find({ user: req.user.id });
  res.json(entries);
});
router.post('/dictionary', async (req, res) => {
  const entry = await DictionaryEntry.create({ user: req.user.id, term: req.body.term, definition: req.body.definition });
  res.json(entry);
});
router.delete('/dictionary/:id', async (req, res) => {
  await DictionaryEntry.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'deleted' });
});

module.exports = router;
