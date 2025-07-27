const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Hardcoded POST route — no input needed
router.post('/', async (req, res) => {
  console.log('📌 Hardcoded POST request received');

  const data = {
    type: 'expense',
    amount: 300,
    category: 'Food',
    description: 'Lunch from Café'
  };

  try {
    const transaction = new Transaction(data);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('❌ Failed to save transaction:', err.message);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

module.exports = router;
