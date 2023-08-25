require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

router.get('/api/notifications', (req, res) => {
    console.log("loading for notifications");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      console.log('Decoded token:', decoded);
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const notifiersPromises = user.notifications.map(async (notification) => {
        console.log("notification ",notification);
        const nUser = await User.findById(notification.from_user);
        console.log("nUser--------",nUser);
        console.log("notifier user", { name: nUser.name, _id: nUser._id });
        return { name: nUser.name, _id: nUser._id };
      });
  
      const notifiers = await Promise.all(notifiersPromises);
  
      console.log("notifiers", notifiers);
  
      if (notifiers) {
        res.json({ message: 'You have access to the protected route', error: "",_id:user._id, notifications: user.notifications, notifiers });
      }
    });
  });

  module.exports = router;