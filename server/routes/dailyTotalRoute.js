const express = require('express');
const router = express.Router();
const DailyTotal = require('../models/dailyTotalModel');
const sequelize = require('../config/dbconfig');

router.get('/getDailyTotal', async (req, res) => {
    try {
        const query = 'SELECT * FROM dailytotals ORDER BY createdAt DESC';
        const [results, metadata] = await sequelize.query(query);
        res.send({ success: true, data: results });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.send({ success: false, message: error.message });
    }
});

router.put('/updateDailyNote', async (req, res) => {
    try {
        const { date, note } = req.body;

        if (!date) {
            return res.status(400).send({ success: false, message: 'Date is required' });
        }

        const updatedDailyTotal = await DailyTotal.findOne({ where: { date } });

        if (!updatedDailyTotal) {
            return res.status(404).send({ success: false, message: 'Daily total not found' });
        }

        updatedDailyTotal.note = note;
        await updatedDailyTotal.save();

        res.send({ success: true, message: 'Daily Note Updated Successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ success: false, message: error.message });
    }
});


router.put('/deleteDailyNote', async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.send({ success: false, message: 'Date is required' });
        }

        const [affectedCount] = await DailyTotal.update(
            { note: null }, // Set note to null
            { where: { date } }
        );

        if (affectedCount === 0) {
            return res.send({ success: false, message: 'Daily total not found' });
        }

        const updatedDailyTotal = await DailyTotal.findOne({ where: { date } });

        res.send({ success: true, data: updatedDailyTotal });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
