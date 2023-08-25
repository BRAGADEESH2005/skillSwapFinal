const express = require("express");
const router = express.Router();
const User = require("../db");


router.post("/api/detect-skill-coins",async (req,res)=>{
    const {userID,feedID} = req.body;
    try {
    const detect_amount_user = await User.findById(feedID);
    const detect_amount = detect_amount_user.amount;
    const send_amount_user = await User.findById(userID);
    const skill_coins = send_amount_user.skillCoins;
    if (skill_coins < detect_amount){
            res.status(200).json({message:"Not enough skill coins",error:"Not enough skill coins for the transaction please purchase some."})
    }else{
      skillCoinDiff = skill_coins - detect_amount;
      updatedAgreedSkillCoins ={
        skillCoins:detect_amount,
        agreedID:feedID
      }
      console.log("updatedd",updatedAgreedSkillCoins)
      console.log("updatedd55",send_amount_user)
      send_amount_user.agreed_skill_coins.push(updatedAgreedSkillCoins);
      console.log("updatedd22",updatedAgreedSkillCoins)
      send_amount_user.skillCoins =  skillCoinDiff;
    
      // Save the updated user object
      const updatedUser = await send_amount_user.save();
      console.log('Agreed skill coins updated successfully:', updatedUser);
      res.status(200).json({message:"Successs",error:""})}
    } catch (error) {
      console.error('Error updating agreed skill coins line 1030:', error);
      res.status(200).json({message:"not successfull",error:"Error"})
    }
    }
  )

  module.exports = router;