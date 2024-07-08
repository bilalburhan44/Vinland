const router = require("express").Router();
const Wallet = require("../models/walletModel");

router.get('/getTotalAmount', async (req, res) => {
    try {
        const totalAmount = await Wallet.findOne({ where: { id: 2 } });
        res.send({ success: true, data: totalAmount }); // Ensure 'data' is sent
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

module.exports = router;
