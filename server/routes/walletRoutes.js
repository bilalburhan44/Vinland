const router = require("express").Router();
const Wallet = require("../models/walletModel");
const sequelize = require("../config/dbconfig");

router.get('/getTotalAmount', async (req, res) => {
    try {
        const query = 'SELECT * FROM wallets WHERE id = 2';
        const [results, metadata] = await sequelize.query(query);

        if (results.length === 0) {
            throw new Error('Wallet with id 2 not found');
        }

        const totalAmount = results[0];
        res.send({ success: true, data: totalAmount });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

module.exports = router;
