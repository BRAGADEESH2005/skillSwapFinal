require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

router.get("/api/user/chat/:chatUserID", async (req, res) => {
    console.log("===============================================-inside chattttt-================================================")
    console.log("Inside user/chat/:chatId-----");
    const to_user_id = req.params.chatUserID;
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      console.log("Inside Not auth Header");
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      console.log('Decoded token:', decoded);
  
      try {
        const user = await User.findById(decoded.userId);
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const chat = user.chats.find(chat => chat.user_id.toString() === to_user_id);
  
        if (!chat) {
          console.log("Error:Chat Not Found")
          return res.status(404).json({ error: 'Chat not found' });
        }
  
        const to_user = await User.findById(to_user_id);
  
        return res.status(200).json({
          message: "Successfully fetched chat",
          chat: chat,
          otherUser: { name: to_user.name, _id: to_user._id,profilePhotoUrl:to_user.image,email:to_user.email },
          error: "",
          user_id: decoded.userId,
        });
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  });


router.get("/api/user/chat",(req,res)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader){
      return res.status(401).json({error:"No token provided"});
    }
  
    const token = authHeader.split(' ')[1]
    jwt.verify(token,secretKey,async(err,decoded)=>{
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const user = await User.findById(decoded.userId);
      if (user && user.chats.length > 0)
      {
      const userIdList = user.chats.map((chat)=>{
              return chat.user_id
      })
    
      try{
      const users = await User.find({_id:{$in:userIdList}});
      const userNameIdList = users.map((user,index)=>{
        return {name:user.name,_id:user._id,image:user.image}
      });
      res.json({ message: 'You have access to the protected route', user ,userNameIdList:userNameIdList});
      }catch(error){
        console.error('Error finding users:', error);
        res.json({message:"No Users",user,userNameIdList:[]})
      }
    }else{
      res.json({message:"No Users",user,userNameIdList:[]})
    }
    })
  })
  
  

  module.exports = router;