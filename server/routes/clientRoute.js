const router = require("express").Router();
const Client = require("../models/clientModel");
authMiddlewares = require("../middlewares/authMiddlewares");

router.get('/getClientById', async (req, res) => {

    const userId = req.body.client_id;
  
    try {
        const client = await Client.findOne({ _id: userId }); // Assuming User is the model for users
        if (client) {
            res.send({
                success: true,
                data: client,
            });
        } else {
            res.send({
                success: false,
                message: 'Client not found',
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
  });

  module.exports = router;