const Client = require('../models/clientModel');
const Project = require('../models/projectModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const router = require('express').Router();



//add projects
router.post('/addProject', async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.send({
            success: true,
            data: newProject,
            message: "Project added successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// Get project by client id
router.get('/getProject/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const projects = await Project.findAll({
        order: [['createdAt', 'DESC']],
        where: { client_id: id },
        include: [{
          model: User,
          attributes: ['name'], // Assuming 'name' is the field you want to retrieve from the User model
        }],
      });
  
      res.send({
        success: true,
        data: projects,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });
  
  module.exports = router;


// Get project by transaction id
router.get('/getTransactionProject/:id', async (req, res) => {
    try {
        const transactionId = req.params.id;

        // Find the transaction by ID
        const transaction = await Transaction.findByPk(transactionId, {
            include: [
                {
                    model: Project,
                    as: 'project'
                }
            ]
        });

        if (!transaction) {
            return res.send({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Get the project associated with the transaction
        const project = transaction.project;

        if (!project) {
            return res.send({
                success: false,
                message: 'Project not found'
            });
        }

        res.send({
            success: true,
            data: project
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//get all projects
router.get('/getAllProjects', async (req, res) => {
    try {
        const projects = await Project.findAll({
            order: [['createdAt', 'DESC']],
            include: [
              { model: User, attributes: ['name'] },
              { model: Client, attributes: ['name'] },
            ],
          });
        res.send({
            success: true,
            data: projects
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//update project
router.put('/updateProject/:id', authMiddlewares, async (req, res) => {
    try {
      const { id } = req.params;
      const { project_name, status, expectedIncome } = req.body;
      const project = await Project.update( { project_name, status, expectedIncome }, { where: { id: id }});
      res.send({
        success: true,
        data: project,
        message: 'Project updated successfully'
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message
      });
    }
  });


//delete project
router.delete('/deleteProject/:id', authMiddlewares, async (req, res) => {

    try {
      const { id } = req.params;
      const project = await Project.destroy({
        where: {
          id: id
        }
      });
      res.send({
        success: true,
        data: project,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.send({
        success: false,
        message: 'Failed to delete client',
      });
    }
  });


module.exports = router;