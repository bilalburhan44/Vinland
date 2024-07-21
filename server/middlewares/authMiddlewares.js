const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("authorization").split(" ")[1];

    const decoded = jwt.verify(token,"Vinland");

   
      req.body.userId = decoded.userId;
      req.user = await User.findOne({ where: { id: decoded.userId } });      

      if (!req.user) {
        throw new Error("User not found");
      }
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};