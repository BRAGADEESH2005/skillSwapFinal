const express = require("express");
const router = express.Router();
const User = require("../db");

router.post("/api/swap-request",async (req,res) => {
    console.log("Inside swap reqqqqq----")
    const {feedID,userID,preachSkill,learnSkill} = req.body;
    console.log("feed",feedID)
    console.log("userID",userID)
    console.log("preachSkill",preachSkill)
    console.log("learnSkill",learnSkill)
    try {
      const updatedFields ={
        notifications:{
          type:"swap-request",
          from_user:userID,
          status:"pending",
          preachSkill:preachSkill,
          learnSkill:learnSkill
          
          
        }
      }
      console.log("User Updated",updatedFields)
      await User.findOneAndUpdate({_id:feedID},{$push:updatedFields})
      .then((response)=>{
        console.log("notification added Successfully")
        res.status(200).json({ message: 'swap-request added succeefully' ,error:""});
      })
      .catch(err => console.log("error in swap notification ",err))
  
    } catch (error) {
      console.log(" main catch ")
      res.status(500).json({ message: 'Error retrieving user' ,error:"true"});
    }
  });


  router.post("/api/accept-swap", async (req, res) => {
    const { feedID, userID, preachSkill,learnSkill} = req.body;
    try {
      console.log("1accept");
  
      console.log("Precah skill",preachSkill,"learan skill",learnSkill)
      let newChatFeed;
      // Update for the user with feedID
      if (preachSkill === null){     newChatFeed = { user_id: userID, messages: [], status: "in_progress",preachSkill:preachSkill ,learnSkill:learnSkill,finish:false,paid:true};}
      else{
        console.log(Date.now)
       newChatFeed = { user_id: userID, messages: [], status: "in_progress",preachSkill:preachSkill ,learnSkill:learnSkill,finish:false};}
      console.log("============================================================================")
      console.log("new chat feed",newChatFeed)
      console.log("============================================================================")
  
      await User.findOneAndUpdate({ _id: feedID }, { $push: { chats: newChatFeed } });
        let newChatUser;
      // Update for the user with userID
      if (preachSkill === null){     newChatUser = { user_id: feedID, messages: [], status: "in_progress",preachSkill:learnSkill,learnSkill:preachSkill,finish:false,paid:true};}
      else{
       newChatUser = { user_id: feedID, messages: [], status: "in_progress",preachSkill:learnSkill,learnSkill:preachSkill,finish:false};}
      await User.findOneAndUpdate({ _id: userID }, { $push: { chats: newChatUser } });
  
      // Delete the notification from the accepting user's notifications
      await User.updateOne({ _id: userID }, { $pull: { notifications: { from_user: feedID } } });
  
      console.log("2accept");
      res.status(200).json({ message: "swap accepted", error: "" });
    } catch (error) {
      res.status(500).json({ error: "Error updating user chats" });
    }
  });
  
  router.post("/api/reject-swap", async (req, res) => {
    const { feedID, userID } = req.body;
    try {
      console.log("1reject");
  
     
      // Delete the notification from the accepting user's notifications
      await User.updateOne({ _id: userID }, { $pull: { notifications: { from_user: feedID } } });
      await User.updateOne({ _id: userID }, { $push: { rejected:  feedID } });
      await User.updateOne({_id:feedID},{$push:{rejected:userID}});
      console.log("2reject");
      res.status(200).json({ message: "swap rejected", error: "" });
    } catch (error) {
      res.status(500).json({ error: "Error updating user chats" });
    }
  });

  router.post("/api/user/swap/form",async (req,res)=>{
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
  })

module.exports = router;