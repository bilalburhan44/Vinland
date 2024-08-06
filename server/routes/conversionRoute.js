const express = require('express');
const router = express.Router();
const Wallet = require('../models/walletModel');

router.post('/convertCurrency', async (req, res) => {
    try {
        const { currencyType, amount, exchangeRate } = req.body;

        // Fetch the wallet (assuming there's only one wallet)
        let wallet = await Wallet.findOne({ where: { id: 2 } }); // Adjust this as needed

        if (!wallet) {
            return res.send({
                success: false,
                message: 'Wallet not found',
            });
        }

        let convertedAmount = 0;
        if (currencyType === 'USD to IQD') {
            convertedAmount = amount * (exchangeRate / 100);
            if (amount > wallet.totalAmountUSD) {
                return res.send({
                    success: false,
                    message: 'Amount exceeds available USD balance',
                });
            }
            wallet.totalAmountUSD -= amount;
            wallet.totalAmountIQD += convertedAmount;
        } else if (currencyType === 'IQD to USD') {
            convertedAmount = amount / (exchangeRate / 100);
            if (amount > wallet.totalAmountIQD) {
                return res.send({
                    success: false,
                    message: 'Amount exceeds available IQD balance',
                });
            }
            wallet.totalAmountUSD += convertedAmount;
            wallet.totalAmountIQD -= amount;
        }

        // Save the updated wallet balances
        await wallet.save();

        res.send({
            success: true,
            message: 'Currency conversion successful',
            data: {
                totalAmountUSD: wallet.totalAmountUSD,
                totalAmountIQD: wallet.totalAmountIQD,
            },
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
