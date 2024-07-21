const router = require("express").Router();
const Client = require("../models/clientModel");
authMiddlewares = require("../middlewares/authMiddlewares");

// router.get('/getClientBy', async (req, res) => {

//     const userId = req.body.client_id;
   
//     try {
//         const client = await Client.findByPk({ _id: userId }); // Assuming User is the model for users
//         if (client) {
//             res.send({
//                 success: true,
//                 data: client,
//             });
//         } else {
//             res.send({
//                 success: false,
//                 message: 'Client not found',
//             });
//         }
//     } catch (error) {
//         res.send({
//             success: false,
//             message: error.message,
//         });
//     }
//   });


router.post('/addClient', async (req, res) => {
  try {
    const { clientName, phoneNumber, address, source } = req.body;
    const existingClient = await Client.findOne({
      where: {
        name: clientName,
        phoneNumber: phoneNumber
      }
    });

    if (existingClient) {
      res.send({
        success: false,
        message: 'Client already exists'
      });
      return; // Exit the function if the client already exists
    }
    
    const client = await Client.create({
      name: clientName,
      phoneNumber,
      address,
      source
    });

    res.send({
      success: true,
      data: client,
      message: 'Client added successfully'
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});

  router.get('/getAllClients', async (req, res) => {
    try {
      const clients = await Client.findAll({order: [['createdAt', 'DESC']]});
      res.send({
        success: true,
        data: clients
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message
      });
    }
  });

  // delete client
  router.delete('/deleteClient/:id', authMiddlewares, async (req, res) => {

    try {
      const { id } = req.params;
      const client = await Client.destroy({
        where: {
          id: id
        }
      });
      res.send({
        success: true,
        data: client,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      res.send({
        success: false,
        message: 'Failed to delete client',
      });
    }
  });

  // edit client 
  router.put('/updateClient/:id', authMiddlewares, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phoneNumber, address, source } = req.body;
      const client = await Client.update({
        name,
        phoneNumber,
        address,
        source
      }, {
        where: {
          id: id
        }
      });
      res.send({
        success: true,
        data: client,
        message: 'Client updated successfully'
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message
      });
    }
  });

  module.exports = router;