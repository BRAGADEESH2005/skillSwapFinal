
const express = require("express");
const router = express.Router();
const User = require("../db");



router.post("/api/user/chat/finish/:receiverID", async (req, res) => {
    const currentUserID = req.body.currentUserID;
    const receiverID = req.params.receiverID;
  
    try {
      // Check if the currentUser has an existing chat with the receiver that's already finished
      const currentUserChat = await User.findOne(
        { _id: currentUserID, 'chats.user_id': receiverID, 'chats.finish': true }
      );
      // console.log("current user finish  value ",currentUserChat)
  
  
      // If there's an existing finished chat, set the current chat's finish to false
      if (currentUserChat !== null) {
      console.log("current user finish  true to false",currentUserChat)
  
        await User.updateOne(
          { _id: currentUserID, 'chats.user_id': receiverID },
          { $set: { 'chats.$.finish': false } }
        );
          console.log("set to false")
  
        res.status(200).json({ message: "Chat finish status updated", ended: "false" });
        return;
      }
      else{
        console.log("current user finish  false to true",currentUserChat)
  
      // If there's an existing unfinished chat, set the finish to true
        // console.log("current user finish  false ",currentUserChat)
  
        await User.updateOne(
          { _id: currentUserID, 'chats.user_id': receiverID },
          { $set: { 'chats.$.finish': true } }
        );
  
        // Check if the receiver also has finished the chat
        const receiverChat = await User.findOne(
          { _id: receiverID, 'chats.user_id': currentUserID, 'chats.finish': true }
        );
  
        // console.log("other user finish  value 1 ",receiverChat)
        console.log("other user finish  value 2",receiverChat===null)
  
        // If both users have finished, remove their chats
        if (receiverChat !== null) {
          const currentUser =await  User.find({_id:currentUserID})
          const currentUserSkill =  currentUser[0].chats.map((user) =>{
            console.log("user id" ,user)
            if(user.user_id.toString() === receiverID.toString()){
              return user
            }
          })
  
          const endDate = new Date();
          const startDate = currentUserSkill[0].startDate;
          console.log("line 544 Startttttt Dateeeee---",startDate);
          // Calculate the time difference in milliseconds
          const timeDiff = endDate - startDate;
  
          // Convert the time difference to days
          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
          console.log("Line 550 days difffff---",daysDiff);
  
          if (daysDiff >10){
            console.log("Inside iff days>10");
            //Paid
            if (currentUserSkill[0].paid ){
              const Fields=  {
                learnSkill:currentUserSkill[0].learnSkill
              }
              const recieverFull = await User.findById(receiverID);
              const currentUserCompletedSkills = {
                skill:currentUserSkill[0].learnSkill.skill,
                category:currentUserSkill[0].learnSkill.category,
                mentor:{_id:receiverID,name:recieverFull.name}
              }
              await User.updateOne(
                { _id: currentUserID },
                { $pull: { chats: { user_id: receiverID } },
                  $push : {completed_skills :currentUserCompletedSkills},
                  $inc: {skillCoins:1} }
              );
  
              await User.updateOne(
                { _id: receiverID },
                { $pull: { chats: { user_id: currentUserID },
                $inc: {skillCoins:1}} 
              }
              );
  
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
                  const updatedUser = await User.findOneAndUpdate(
                    { _id: receiverID },
                    { $inc: { skillCoins: userExistsInAgreedSkillCoins.skillCoins } },
                    { new: true } // To return the updated document
                  );
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
                const updatedUser = await User.findOneAndUpdate(
                  { _id: currentUserID },
                  { $inc: { skillCoins: userExistsInAgreedSkillCoins.skillCoins } },
                  { new: true } // To return the updated document
                );
                console.log("User skill coins added");
                const updatedUser2 = await User.findOneAndUpdate(
                  { _id: receiverID },
                  { $pull: { agreed_skill_coins: { agreedID: currentUserID } } },
                  { new: true } // To return the updated document
                );
              }
            
            
            }else{
              
              console.log("---------",currentUserSkill);
              const Fields=  {
                preachSkill:currentUserSkill[0].preachSkill,
                learnSkill:currentUserSkill[0].learnSkill
              }
              const recieverFull = await User.findById(receiverID);
      
              console.log("current user fields in finish ", Fields);
              console.log("currentIDType------",typeof(currentUserID));
      
              console.log("Chat5444444444444444444444444444444444444444444s delete exe")
              const recieverCompletedSkills = {
                skill:currentUserSkill[0].preachSkill.skill,
                category:currentUserSkill[0].preachSkill.category,
                mentor:{_id:currentUserID,name:currentUser[0].name}
              }
              console.log("receiverrrr----",recieverCompletedSkills)
              const currentUserCompletedSkills = {
                skill:currentUserSkill[0].learnSkill.skill,
                category:currentUserSkill[0].learnSkill.category,
                mentor:{_id:receiverID,name:recieverFull.name}
              }
              console.log("currenttterrrr----", currentUserCompletedSkills)
              await User.updateOne(
                { _id: currentUserID },
                { $pull: { chats: { user_id: receiverID } },
                  $push : {completed_skills :currentUserCompletedSkills},
                  $inc: {skillCoins:1} }
              );
              await User.updateOne(
                { _id: receiverID },
                { $pull: { chats: { user_id: currentUserID } } ,
                $push : {completed_skills :recieverCompletedSkills},
                $inc: {skillCoins:1}
              }
              );
            }
            }else{
          if (currentUserSkill[0].paid ){
  
            const recieverFull = await User.findById(receiverID);
            await User.updateOne(
              { _id: currentUserID },
              { $pull: { chats: { user_id: receiverID } } }
            );
  
            await User.updateOne(
              { _id: receiverID },
              { $pull: { chats: { user_id: currentUserID } } 
            }
            );
  
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
                const updatedUser = await User.findOneAndUpdate(
                  { _id: receiverID },
                  { $inc: { skillCoins: Math.floor(0.9*(userExistsInAgreedSkillCoins.skillCoins)) } },
                  { new: true } // To return the updated document
                );
                console.log("innnseeddd 90%%%%%%%");
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
              const updatedUser = await User.findOneAndUpdate(
                { _id: currentUserID },
                { $inc: { skillCoins: Math.floor(0.9*userExistsInAgreedSkillCoins.skillCoins) } },
                { new: true } // To return the updated document
              );
              console.log("successsss in 90%%%%%");
              console.log("User skill coins added");
              const updatedUser2 = await User.findOneAndUpdate(
                { _id: receiverID },
                { $pull: { agreed_skill_coins: { agreedID: currentUserID } } },
                { new: true } // To return the updated document
              );
            }
          
          
          }
  
          else{
          console.log("10 days not paseed");
          await User.updateOne(
            { _id: currentUserID },
            { $pull: { chats: { user_id: receiverID } } }
          );
          await User.updateOne(
            { _id: receiverID },
            { $pull: { chats: { user_id: currentUserID } } }
            
      
          );}
        }
  
          res.status(200).json({ message: "Chats removed", ended: "true" });
          return;
        }
  
        res.status(200).json({ message: "Chat finish status updated", ended: "false" });
      } 
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error updating chat" });
    }
  })

module.exports = router;