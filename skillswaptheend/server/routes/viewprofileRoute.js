const express = require("express");
const router = express.Router();
const User = require("../db");


router.get("/api/user/:userID",async (req,res)=>{
    const user_id = req.params.userID;
    console.log("User",user_id)
    try {
      // Using findOne to find a user by ID
      const user = await User.findOne({ _id: user_id });
  
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log("ute ",user)
  
      res.status(200).json({message:"User Found",user});
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user' });
    }
  }
    )

module.exports = router;