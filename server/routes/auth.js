const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const makeCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const emailEnabled = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const transporter = emailEnabled ? nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}) : null;

const sendVerificationEmail = async (to, code) => {
  if (!transporter) {
    console.warn('Email not configured; skipping verification email.');
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Verify your My DarieS account',
    text: `Your verification code is ${code}`,
    html: `<p>Your verification code is <strong>${code}</strong></p>`
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyCode = makeCode();

    user = await User.create({ firstName, lastName, email, passwordHash, verifyCode, verified: false });

    try {
      await sendVerificationEmail(email, verifyCode);
    } catch (err) {
      console.error('Verification email failed:', err);
    }

    return res.json({ message: 'Account created', verifyCode });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.verified) return res.json({ message: 'Already verified' });
  if (user.verifyCode !== code) return res.status(400).json({ message: 'Invalid code' });
  user.verified = true; user.verifyCode = undefined; await user.save();
  return res.json({ message: 'Email verified' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: 'Incorrect password' });

  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
  res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, verified: user.verified } });
});

// POST /api/auth/forgot
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.resetCode = makeCode(); await user.save();
  // send via email in real app.
  res.json({ message: 'Reset code sent', resetCode: user.resetCode });
});

// POST /api/auth/reset
router.post('/reset', async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user || user.resetCode !== code) return res.status(400).json({ message: 'Invalid request' });
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetCode = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

module.exports = router;
