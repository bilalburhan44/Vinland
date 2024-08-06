const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');
const Transaction = require('../models/transactionModel');
const DailyTotal = require('../models/dailyTotalModel');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const sequelize = require('../config/dbconfig');
const ExchangeRate = require('../models/exchangeRatemodel');
const { Op } = require('sequelize');
const Project = require('../models/projectModel');

router.post('/addTransaction', async (req, res) => {
  try {
    const {projectName, clientName, phoneNumber, type, payment, amount_usd, amount_iqd, description, date, userId } = req.body;

    // Check if client exists
    const existingClient = await Client.findOne({
      where: {
        name: clientName,
        phoneNumber: phoneNumber,
      },
    });

    if (!existingClient) {
      res.send({
        success: false,
        message: 'Client not found',
      });
      return;
    }

    const client = existingClient;


    const existingProject = await Project.findOne({
      where: {
        project_name: projectName,
      },
    });

    if (!existingProject) {
      res.send({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    const project = existingProject;
    // Fetch the latest exchange rate
    const latestExchangeRate = await ExchangeRate.findOne({
      order: [['updatedAt', 'DESC']],
    });

    if (!latestExchangeRate) {
      throw new Error('No exchange rate found');
    }

    // Insert data into Transaction model
    const transaction = await Transaction.create({
      type,
      payment,
      amount_usd,
      amount_iqd,
      description,
      date,
      rate_id: latestExchangeRate.id,
      user_id: userId,
      client_id: client.id,
      project_id: project.id
    });

    // Insert data into DailyTotal model
    const [dailyTotal, created] = await DailyTotal.findOrCreate({ where: { date } });

    if (type === 'income') {
      const parsedAmountUSD = parseFloat(amount_usd);
      const parsedAmountIQD = parseFloat(amount_iqd);

      if (!isNaN(parsedAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) + parsedAmountUSD;
      }

      if (!isNaN(parsedAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) + parsedAmountIQD;
      }
    } else if (type === 'outcome') {
      const parsedAmountUSD = parseFloat(amount_usd);
      const parsedAmountIQD = parseFloat(amount_iqd);

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
      const parsedAmountUSD = parseFloat(amount_usd);
      const parsedAmountIQD = parseFloat(amount_iqd);

      if (!isNaN(parsedAmountUSD)) {
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + parsedAmountUSD;
      }

      if (!isNaN(parsedAmountIQD)) {
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + parsedAmountIQD;
      }
    } else if (type === 'outcome') {
      const parsedAmountUSD = parseFloat(amount_usd);
      const parsedAmountIQD = parseFloat(amount_iqd);

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
});

// Get transactions
router.get('/getTransactions', async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      type,
      payment,
      amountUSDMin,
      amountUSDMax,
      amountIQDMin,
      amountIQDMax,
      startDate,
      endDate,
    } = req.query;

    let filter = {};

    if(projectName){
      filter['$project.project_name$'] = projectName;
    }

    if (clientName) {
      filter['$Client.name$'] = clientName;
    }
    if (type) {
      filter.type = type;
    }
    if (payment) {
      filter.payment = payment;
    }
    if (amountUSDMin) {
      filter.amount_usd = { [Op.gte]: parseFloat(amountUSDMin) };
    }
    if (amountUSDMax) {
      filter.amount_usd = { ...filter.amount_usd, [Op.lte]: parseFloat(amountUSDMax) };
    }
    if (amountIQDMin) {
      filter.amount_iqd = { [Op.gte]: parseFloat(amountIQDMin) };
    }
    if (amountIQDMax) {
      filter.amount_iqd = { ...filter.amount_iqd, [Op.lte]: parseFloat(amountIQDMax) };
    }
    if (startDate && endDate) {
      filter.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const transactions = await Transaction.findAll({
      where: filter,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'phoneNumber'],
        },
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: Project,
          as: 'project'
      }
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

// delete transaction
router.delete('/deleteTransaction/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the transaction details
    const transaction = await Transaction.findOne({ where: { transaction_id: id } });
    if (!transaction) {
      return res.status(404).send({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Fetch the daily total for the transaction date
    const dailyTotal = await DailyTotal.findOne({ where: { date: transaction.date } });
    if (!dailyTotal) {
      return res.status(404).send({
        success: false,
        message: 'Daily total not found',
      });
    }

    // Undo the transaction's financial impact on the daily total
    if (transaction.type === 'income') {
      const parsedAmountUSD = parseFloat(transaction.amount_usd);
      const parsedAmountIQD = parseFloat(transaction.amount_iqd);
    
      if (!isNaN(parsedAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) - parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) - parsedAmountIQD;
      }
    } else if (transaction.type === 'outcome') {
      const parsedAmountUSD = parseFloat(transaction.amount_usd);
      const parsedAmountIQD = parseFloat(transaction.amount_iqd);
    
      if (!isNaN(parsedAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) + parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) + parsedAmountIQD;
      }
    }

    // Save the updated daily total
    await dailyTotal.save();

    // Fetch the wallet to update its balance
    const wallet = await Wallet.findOne({ where: { id: 2 } }); // Adjust according to your wallet ID logic
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Undo the transaction's financial impact on the wallet
    if (transaction.type === 'income') {
      const parsedAmountUSD = parseFloat(transaction.amount_usd);
      const parsedAmountIQD = parseFloat(transaction.amount_iqd);
    
      if (!isNaN(parsedAmountUSD)) {
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) - parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) - parsedAmountIQD;
      }
    } else if (transaction.type === 'outcome') {
      const parsedAmountUSD = parseFloat(transaction.amount_usd);
      const parsedAmountIQD = parseFloat(transaction.amount_iqd);
    
      if (!isNaN(parsedAmountUSD)) {
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + parsedAmountUSD;
      }
    
      if (!isNaN(parsedAmountIQD)) {
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + parsedAmountIQD;
      }
    }

    // Save the updated wallet
    await wallet.save();

    // Delete the transaction
    await Transaction.destroy({ where: { transaction_id: id } });

    res.send({
      success: true,
      message: 'Transaction deleted and financial impact undone successfully',
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Assuming you have imported necessary models and dependencies

router.put('/updateTransaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, phoneNumber, type, payment, amount_usd, amount_iqd, description, date, userId } = req.body;

    // Fetch the transaction details using the provided ID
    const transaction = await Transaction.findOne({ where: { transaction_id: id } });
    if (!transaction) {
      return res.status(404).send({
        success: false,
        message: 'Transaction not found',
      });
    }

    const client = await Client.findOne({
      where: { name: clientName, phoneNumber: phoneNumber },
    });
    if (!client) {
      throw new Error('Client not found');
    }

    // Calculate financial impact changes
    const oldAmountUSD = transaction.amount_usd || 0;
    const oldAmountIQD = transaction.amount_iqd || 0;
    const newAmountUSD = parseFloat(amount_usd);
    const newAmountIQD = parseFloat(amount_iqd);

    const oldType = transaction.type;

    // Fetch daily total and wallet
    const dailyTotal = await DailyTotal.findOne({ where: { date: transaction.date } });
    if (!dailyTotal) {
      throw new Error('Daily total not found');
    }

    const wallet = await Wallet.findOne({ where: { id: 2 } }); // Adjust according to your wallet ID logic
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Undo previous financial impact
    if (oldType === 'income') {
      if (!isNaN(oldAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) - oldAmountUSD;
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) - oldAmountUSD;
      }
      if (!isNaN(oldAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) - oldAmountIQD;
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) - oldAmountIQD;
      }
    } else if (oldType === 'outcome') {
      if (!isNaN(oldAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) + oldAmountUSD;
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + oldAmountUSD;
      }
      if (!isNaN(oldAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) + oldAmountIQD;
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + oldAmountIQD;
      }
    }

    // Apply new financial impact
    if (type === 'income') {
      if (!isNaN(newAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) + newAmountUSD;
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) + newAmountUSD;
      }
      if (!isNaN(newAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) + newAmountIQD;
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) + newAmountIQD;
      }
    } else if (type === 'outcome') {
      if (!isNaN(newAmountUSD)) {
        dailyTotal.totalAmountUSD = (dailyTotal.totalAmountUSD || 0) - newAmountUSD;
        wallet.totalAmountUSD = (wallet.totalAmountUSD || 0) - newAmountUSD;
      }
      if (!isNaN(newAmountIQD)) {
        dailyTotal.totalAmountIQD = (dailyTotal.totalAmountIQD || 0) - newAmountIQD;
        wallet.totalAmountIQD = (wallet.totalAmountIQD || 0) - newAmountIQD;
      }
    }

    // Save the updated daily total and wallet
    await dailyTotal.save();
    await wallet.save();

    // Update transaction details
    transaction.type = type;
    transaction.payment = payment;
    transaction.amount_usd = newAmountUSD;
    transaction.amount_iqd = newAmountIQD;
    transaction.description = description;
    transaction.date = date;
    transaction.client_id = client.id;
    transaction.user_id = userId;

    // Save the updated transaction
    await transaction.save();

    res.send({
      success: true,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('Failed to update transaction:', error);
    res.status(500).send({
      success: false,
      message: error.message || 'Failed to update transaction',
    });
  }
});

//get transaction by id
router.get('/getTransaction/:clientId/:projectId', async (req, res) => {
  try {
    const { clientId, projectId } = req.params;

    let filter = {
      client_id: clientId,
      project_id: projectId
    };

    const transactions = await Transaction.findAll({
      where: filter,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'phoneNumber'],
        },
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.send({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;
