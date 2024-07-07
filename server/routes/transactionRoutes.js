const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');
const Transaction = require('../models/transactionModel');
const DailyTotal = require('../models/dailyTotalModel');
const Wallet = require('../models/walletModel');


router.post('/addTransaction', async (req, res) => {
  try {
    const { clientName, phoneNumber, type, payment, amountUSD, amountIQD,description, date, userId } = req.body;

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
    const dailyTotal = await DailyTotal.findOrCreate({ where: { date } });
    // Update daily total based on transaction type
    if (type === 'income') {
      dailyTotal[0].totalAmountUSD = (dailyTotal[0].totalAmountUSD || 0) + parseFloat(amountUSD);
      dailyTotal[0].totalAmountIQD = (dailyTotal[0].totalAmountIQD || 0) + parseFloat(amountIQD);
    } else if (type === 'outcome') {
      dailyTotal[0].totalAmountUSD = (dailyTotal[0].totalAmountUSD || 0) - parseFloat(amountUSD);
      dailyTotal[0].totalAmountIQD = (dailyTotal[0].totalAmountIQD || 0) - parseFloat(amountIQD);
    }
    await dailyTotal[0].save();

    // Update Wallet based on transaction type
    // Update Wallet based on transaction type
let wallet = await Wallet.findOne(); // Assuming there is only one Wallet record

if (!wallet) {
  // Create a new wallet record if none is found
  wallet = await Wallet.create({ totalAmountUSD: 0, totalAmountIQD: 0 });
}

if (type === 'income') {
  wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + parseFloat(amountUSD);
  wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + parseFloat(amountIQD);
} else if (type === 'outcome') {
  wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) - parseFloat(amountUSD);
  wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) - parseFloat(amountIQD);
}

// Save the updated wallet
await wallet.save();

res.send({
  success : true,
  message : 'Transaction added successfully',
})
} catch (error) {
  res.send({
      success : false,
      message : error.message
  })
}
});

//get the transactions
router.get('/getTransactions', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']] // Sort transactions by createdAt field in descending order
  });
    res.send({
      success : true,
       data : transactions,
  })
  } catch (error) {
    res.send({
        success : false,
        message : error.message
    })
 }
});




module.exports = router;