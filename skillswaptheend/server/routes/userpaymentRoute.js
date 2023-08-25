const express = require("express");
const router = express.Router();
const User = require("../db");

router.post("/api/user/payment/form",async (req,res)=>{
    const {senderID,receiverID}=req.body;
    console.log("Skilssssssss",senderID,receiverID)
    try{
    const sender =await User.findById(senderID);
    const receiver =await User.findById(receiverID);
    if (sender && receiver){
      console.log("Senderr Skils",sender.skillsKnown)
      console.log("Receiver Skils",receiver.skillsKnown)
      res.status(200).json({message:"Success",error:"",preachSkills:sender.skillsKnown,learnSkills:receiver.skillsKnown})
    }
    else{
      res.status(500).json({message:"NotFound",error:"User Not Found"})
    }
    }catch(err){
      console.log(err);
      res.status(500).json({message:"NotFound",error:"User Not Found"});
    }
  });
  
router.post("/api/pay-request",async (req,res)=>{
    console.log("Inside swap reqqqqq----")
    const {feedID,userID,learnSkill} = req.body;
    console.log("feed",feedID)
    console.log("userID",userID)
    console.log("learnSkill",learnSkill)
    try {
      const updatedFields ={
        notifications:{
          type:"pay-request",
          from_user:userID,
          status:"pending",
          learnSkill:learnSkill
          
          
        }
      }
      console.log("User Updated",updatedFields)
      await User.findOneAndUpdate({_id:feedID},{$push:updatedFields})
      .then((response)=>{
        console.log("notification added Successfully")
        res.status(200).json({ message: 'pay-request added succeefully' ,error:""});
      })
      .catch(err => console.log("error in pay notification ",err))
  
    } catch (error) {
      console.log(" main catch ")
      res.status(500).json({ message: 'Error retrieving user' ,error:"true"});
    }
  });
  
router.post("/api/accept-pay",async (req,res)=>{
    const { feedID, userID,learnSkill} = req.body;
    try {
      await User.findOneAndUpdate(
        { _id: userID},
        {
          $push: {
            acceptedPaidUser: { users: feedID, learnSkill: learnSkill },
          },
        }
      );
          // Delete the notification from the accepting user's notifications
          await User.updateOne({ _id: userID }, { $pull: { notifications: { from_user: feedID } } });
  
      await User.findOneAndUpdate(
        {_id:feedID},
        {
          $push: {
            notifications: { type:"Accepted-Pay",from_user:userID,learnSkill:learnSkill },
          },
        }
      )
      res.status(200).json({message:"Success",error:""});
    } catch (error) {
      console.log("Error in 999",error)
      res.status(500).json({ error: "Error updating user chats" });
    }
  
  })
  
  // paying after accept button Route
router.post("/api/user/pay", async (req, res) => {
    const { feedID, userID,learnSkill} = req.body;
    try {
      console.log("1accept");
  
      console.log("learan skill",learnSkill)
      // Update for the user with feedID
      
      const newChatFeed = { user_id: userID, messages: [], status: "in_progress",preachSkill:learnSkill ,finish:false};
      console.log("============================================================================")
      console.log("new chat feed",newChatFeed)
      console.log("============================================================================")
  
        const user = await User.findById(userID);
        
  
      //push paid remove accepted
  
  // Define the updates separately
  const pushToChats = { $push: { chats: newChatFeed } };
  const pushToPaidUsers = { $push: { paidUsers: { users: userID, learnSkill, startDate: Date.now(), amount: userAmount } } };
  const pullFromAcceptedPaidUser = { $pull: { acceptedPaidUser: { users: userID } } };
  
  // Combine the updates and execute the operation
  try {
    await User.findOneAndUpdate(
      { _id: feedID },
      { $set: pushToChats, $set: pushToPaidUsers, $set: pullFromAcceptedPaidUser }
    );
    console.log('Update successful');
  } catch (error) {
    console.error('Error:', error);
  }
  
      // Update for the user with userID
      const newChatUser = { user_id: feedID, messages: [], status: "in_progress",learnSkill:learnSkill,finish:false};
      await User.findOneAndUpdate({ _id: userID }, { $push: { chats: newChatUser } });
  
  
      console.log("2accept");
      res.status(200).json({ message: "swap accepted", error: "" });
    } catch (error) {
      res.status(500).json({ error: "Error updating user chats" });
    }
  });

  module.exports =router;