const express = require('express');
const ExchangeRate = require('../models/exchangeRatemodel');
const router = express.Router();

// add exchange rate
router.post('/addExchangeRate', async (req, res) => {
  try {
    const newRate = await ExchangeRate.create(req.body);
    res.send({
      success: true,
      data: newRate,
      message: "Rate added successfully"
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});

// get exchange rate 
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
