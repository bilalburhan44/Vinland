const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');
const Transaction = require('../models/transactionModel');
const DailyTotal = require('../models/dailyTotalModel');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const sequelize = require('../config/dbconfig');
router.post('/addTransaction', async (req, res) => {
  try {
    const { clientName, phoneNumber, type, payment, amountUSD, amountIQD, description, date, userId } = req.body;

    // Insert data into Client model
    const client = await Client.createClient(clientName, phoneNumber);

    // Insert data into Transaction model
    const transaction = await Transaction.create({
      type,
      payment,
      amount_usd: amountUSD,
      amount_iqd: amountIQD,
      description,
      date,
      user_id: userId,
      client_id: client.id,
    });

// Insert data into DailyTotal model
const [dailyTotal, created] = await DailyTotal.findOrCreate({ where: { date } });

if (type === 'income') {
  const parsedAmountUSD = parseFloat(amountUSD);
  const parsedAmountIQD = parseFloat(amountIQD);

  if (!isNaN(parsedAmountUSD)) {
    dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) + parsedAmountUSD;
  }

  if (!isNaN(parsedAmountIQD)) {
    dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) + parsedAmountIQD;
  }
} else if (type === 'outcome') {
  const parsedAmountUSD = parseFloat(amountUSD);
  const parsedAmountIQD = parseFloat(amountIQD);

  if (!isNaN(parsedAmountUSD)) {
    dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) - parsedAmountUSD;
  }

  if (!isNaN(parsedAmountIQD)) {
    dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) - parsedAmountIQD;
  }
}

// Save the updated daily total
await dailyTotal.save();




    let wallet = await Wallet.findOne({ where: { id: 2 } }); // Assuming you fetch the wallet by ID

    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    if (type === 'income') {
      const parsedAmountUSD = parseFloat(amountUSD);
      const parsedAmountIQD = parseFloat(amountIQD);
    
      if (!isNaN(parsedAmountUSD)) {
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + parsedAmountIQD;
      }
    } else if (type === 'outcome') {
      const parsedAmountUSD = parseFloat(amountUSD);
      const parsedAmountIQD = parseFloat(amountIQD);
    
      if (!isNaN(parsedAmountUSD)) {
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) - parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) - parsedAmountIQD;
      }
    }
    
    // Save the updated wallet
    await wallet.save();

    res.send({
      success: true,
      message: 'Transaction added successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
})

// Get transactions
router.get('/getTransactions', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']], // Sort transactions by createdAt field in descending order
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'phoneNumber'], // Specify the attributes you need from the Client model
        },
        {
          model: User,
          attributes: ['id', 'name'], // Specify the attributes you need from the User model
        },
      ],
    });
    res.send({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
