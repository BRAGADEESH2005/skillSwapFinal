require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const { format } = require('date-fns');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

router.post("/api/user/:otherUserId/send-message", async (req, res) => {
    console.log("Inside the Message Route------");
    const to_user = req.params.otherUserId;
    const { newMessage, from_user_token } = req.body;
  
    try {
      const decoded = jwt.verify(from_user_token, secretKey);
      console.log('Decoded token:', decoded);
      console.log("message  ", newMessage);
      const from_user_id = decoded.userId;
  
      const fromUser = await User.findById(from_user_id);
      const toUser = await User.findById(to_user);
  
      if (!fromUser || !toUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create a new message object
      const message = {
        from_user: from_user_id,
        to_user: to_user,
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Format the timestamp using date-fns
        message: newMessage,
      };
      console.log("msgggggg", message);
  
      // Find the chat in which user_id is equal to the other user's ID for both users
      const fromUserChat = fromUser.chats.find(chat => chat.user_id.toString() === to_user);
      const toUserChat = toUser.chats.find(chat => chat.user_id.toString() === from_user_id);
  
      // Append the new message to the chats
      if (fromUserChat) {
        fromUserChat.messages.push(message);
      } else {
        console.log("error in retrieving fromchatuser  ", fromUserChat);
      }
  
      if (toUserChat) {
        toUserChat.messages.push(message);
      } else {
        console.log("error in retrieving tochatuser ", toUserChat);
      }
  
      // Save both users with updated chat
      await fromUser.save();
      await toUser.save();
  
      res.status(200).json({ message: 'Message sent successfully', error: "" });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  module.exports = router;