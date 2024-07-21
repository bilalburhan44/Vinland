const express = require('express');
const ExchangeRate = require('../models/exchangeRatemodel');
const router = express.Router();

router.get('/getExchangeRate', async (req, res) => {
  try {
    const latestExchangeRate = await ExchangeRate.findOne({
      order: [['updatedAt', 'DESC']], // Get the latest exchange rate
    });

    if (!latestExchangeRate) {
      throw new Error('No exchange rate found');
    }

    res.send({
      success: true,
      data: { exchangeRate: latestExchangeRate.rate },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

