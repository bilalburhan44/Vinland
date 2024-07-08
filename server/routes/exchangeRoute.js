const express = require('express');
const router = express.Router();
const { getExchangeRate } = require('../config/exchangeRateService');

// Endpoint to get exchange rate
router.get('/:fromCurrency/:toCurrency', async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    res.status(200).json({ rate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

module.exports = router;