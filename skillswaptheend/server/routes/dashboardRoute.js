require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

router.get('/api/dashboard', async (req, res) => {
    console.log("loading for dashboard");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; 
    jwt.verify(token, secretKey, async(err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }
    
      console.log('Decoded token:', decoded);
    
     
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('Fetched user details:', user.name);
      console.log("gender ", user.gender);
      
      if (user.gender === "") {
        res.json({ error: 'not filled details', user });
      } else {
        try { 
          const arrayOfExcludedUserIds=user.chats.map((chat)=>{
            return chat.user_id
          })
          arrayOfExcludedUserIds.push(user._id)
          arrayOfExcludedUserIds.push(...user.rejected)
          console.log("ara cate ",arrayOfExcludedUserIds)
  
          const requiredCategories = user.skillsRequired.map((skill) => skill.category);
          const users = await User.find({
            _id: { $nin: arrayOfExcludedUserIds }, // Exclude current user and users in arrayOfExcludedUserIds
            skillsKnown: { $elemMatch: { category: { $in: requiredCategories } } },
          }).exec();
  
          
          
          console.log('Users with any one of the required categories in skillsKnown:', users.length);
      
          res.json({ message: 'You have access to the protected route', user, feed: users });
        } catch (error) {
          console.error('Error finding users:', error);
          res.status(500).json({ error: 'Error finding users' });
        }
      }
      
    });
  });

  module.exports = router;