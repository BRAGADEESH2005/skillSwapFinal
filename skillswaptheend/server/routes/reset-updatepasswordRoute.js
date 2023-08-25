const express = require("express");
const router = express.Router();
const User = require("../db");
const bcrypt = require('bcrypt');


router.post("/api/reset-password",async (req,res)=>{
    const {newtoken} = req.body;
    console.log("New token line 736:",newtoken);
    try {
      const user = await User.findOne({ 'resetToken.token': newtoken }).exec();
  
      if (user) {
        // User with the provided token exists
        console.log('User with token exists line 741:');
        res.status(200).json({message:"Success",error:""})
      } else {
        // User with the provided token doesn't exist
        console.log('User with token not found line 745');
        res.status(400).json({message:"failure",error:"User not found"})
      }
    } catch (error) {
      console.error('Error line 749:', error);
      res.status(400).json({message:"catch error",error:"Catch error"})
    }
  }
  
  )
  
router.post("/api/update-password",async (req,res)=>{
    const {newtoken,password} = req.body;
    console.log("New token line 736:",newtoken);
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Find the user with the given reset token and update the password field
      const updatedUser = await User.findOneAndUpdate(
        { 'resetToken.token': newtoken },
        {
          $set: {
            password: hashedPassword,
            resetToken: {}, // Clear the reset token
          },
        },
        { new: true } // Return the updated user document
      );
  
      if (!updatedUser) {
        throw new Error('Invalid or expired reset token.');
      }
      res.status(200).json({message:"Success",error:""})
  
      console.log('Password updated successfully.');
    } catch (error) {
      res.status(400).json({message:"Failure",error:"Not updated password"})
      console.error('Error updating password:', error.message);
    
    }
  }
  )

module.exports = router;