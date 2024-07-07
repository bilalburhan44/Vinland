const router = require("express").Router();
const User = require("../models/userModel");
authMiddlewares = require("../middlewares/authMiddlewares");
const jwt = require('jsonwebtoken');

router.post("/authentication/sign-up", async (req, res) => {
    try {
      console.log(req.body.email);
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        throw new Error("user already exist");
      }
      if (req.body.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
  
      //new user
      const NewUser = new User(req.body);
      await NewUser.save();
  
      res.send({
        success: true,
        message: "User created successfully"
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });



  router.post('/authentication/sign-in',async(req,res)=>{
  
    try {
        const user = await User.findOne({ email: req.body.email });
    if(!user){
        throw new Error('user does not exist')
    }

    //compare pass
 
    if(req.body.password != user.password){
        throw new Error('invalid password');
    }
     const token = jwt.sign({userId : user.id}, "Vinland",{expiresIn : '2d'});
    // success
    
    res.send({
        success:true,
        message : "logged in successfully",
        data : token,
    })
    } catch (error) {
        res.send({
            success : false,
            message : error.message,
           
        })
    }
    })


    router.get('/get-current-user', authMiddlewares, async (req, res) => {
        try {
            const userId = req.body.userId; // Ensure you're getting the correct user ID, possibly from req.user or similar
      
            // fetch the user from database
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }
      
      
            res.send({
                success: true,
                data: user
            });
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            });
        }
      });

      router.get('/getUserById', async (req, res) => {
        const userId = req.body.userId;
      
        try {
            const user = await User.findOne({ _id: userId }); // Assuming User is the model for users
            if (user) {
                res.send({
                    success: true,
                    data: user,
                });
            } else {
                res.send({
                    success: false,
                    message: 'User not found',
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