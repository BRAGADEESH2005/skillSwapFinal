
const express = require("express");
const router = express.Router();
const User = require("../db");


router.post("/api/user/chat/report/:receiverID", async (req, res) => {
    const currentUserID = req.body.currentUserID;
    const receiverID = req.params.receiverID; // Extract receiver ID from params
  
    try {
  
      const currentUser =await  User.find({_id:currentUserID})
      const currentUserSkill =  currentUser[0].chats.map((user) =>{
        console.log("user id" ,user)
        if(user.user_id.toString() === receiverID.toString()){
          return user
        }})
      if (currentUserSkill[0].paid){
        const endDate = new Date();
        const startDate = currentUserSkill[0].startDate;
        console.log("line 544 Startttttt Dateeeee---",startDate);
        // Calculate the time difference in milliseconds
        const timeDiff = endDate - startDate;
  
        // Convert the time difference to days
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        console.log("Line 550 days difffff---",daysDiff);
        //transfer skillcoins
        const user = await User.findById(currentUserID) ;
              
        if (!user) {
          console.log('User not found.');
          return;
        }
      
        // Check if the user ID exists in agreed_skill_coins
        const userExistsInAgreedSkillCoins = user.agreed_skill_coins.find(
          coin => coin.agreedID.equals(receiverID)
        );
      
        if (userExistsInAgreedSkillCoins) {
          console.log('User ID exists in agreed_skill_coins.');
          // Update the skillCoins field by incrementing the value
          let updatedUser;
          if(daysDiff < 2){
           updatedUser = await User.findOneAndUpdate(
            { _id: receiverID },
            { $inc: { skillCoins: Math.floor(0.25 * userExistsInAgreedSkillCoins.skillCoins) } },
            { new: true } // To return the updated document
          );
  
          await User.findOneAndUpdate({_id:currentUserID},{ $inc: { skillCoins: Math.floor(0.75 * userExistsInAgreedSkillCoins.skillCoins) } },
          { new: true });
        }else{
          updatedUser = await User.findOneAndUpdate(
            { _id: receiverID },
            { $inc: { skillCoins: Math.floor(0.90 * userExistsInAgreedSkillCoins.skillCoins) } },
            { new: true } // To return the updated document
          );
        }
          console.log("User skill coins added");
          const updatedUser2 = await User.findOneAndUpdate(
            { _id: currentUserID },
            { $pull: { agreed_skill_coins: { agreedID: receiverID } } },
            { new: true } // To return the updated document
          );
      }else{
        const otherUser = await User.findById(receiverID);
        if(!otherUser){
          console.log('User not found.');
          return;
        }
        const userExistsInAgreedSkillCoins = otherUser.agreed_skill_coins.find(
          coin => coin.agreedID.equals(currentUserID)
        );
        console.log('User ID exists in agreed_skill_coins.');
        // Update the skillCoins field by incrementing the value
        let updatedUser;
        if (daysDiff <2){
         updatedUser = await User.findOneAndUpdate(
          { _id: currentUserID },
          { $inc: { skillCoins: Math.floor(0.25 * userExistsInAgreedSkillCoins.skillCoins)} },
          { new: true } // To return the updated document
        );
        await User.findOneAndUpdate({_id:receiverID},{ $inc: { skillCoins: Math.floor(0.75 * userExistsInAgreedSkillCoins.skillCoins) } },
        { new: true });
      }else{
        updatedUser = await User.findOneAndUpdate(
          { _id: currentUserID },
          { $inc: { skillCoins: Math.floor(0.90 * userExistsInAgreedSkillCoins.skillCoins) } },
          { new: true } // To return the updated document
        );
      }
        console.log("User skill coins added");
        const updatedUser2 = await User.findOneAndUpdate(
          { _id: receiverID },
          { $pull: { agreed_skill_coins: { agreedID: currentUserID } } },
          { new: true } // To return the updated document
        );
  
      }}
      // Remove the chat between currentUserID and receiverID
      await User.updateOne(
        { _id: currentUserID },
        {
          $pull: { chats: { user_id: receiverID } },
          $push: { rejected: receiverID }
        }
      );
      // Remove the chat between receiverID and currentUserID
      await User.updateOne(
        { _id: receiverID },
        { $pull: { chats: { user_id: currentUserID }}, $push : {rejected : currentUserID}} 
      );
      console.log("Rejecteddddd==========")
  
      res.status(200).json({ message: "chat removed", error: "" ,ended:"true"});
     }catch (error) {
      console.log(error);
      res.status(400).json({ error: "User Not Found" });
    }
  });

  module.exports = router;