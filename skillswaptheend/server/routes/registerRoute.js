require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY; 

router.post('/api/register', async (req, res) => {
  
    console.log("registering user")
    console.log(req.body)
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      // res.status(201).json({ message: 'User registered successfully' });
      const token = jwt.sign({ userId: user._id }, secretKey);
      res.json({ token });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        console.log(error)
        res.status(500).json({ error: 'Failed to register user' });
      }
    }
  });

module.exports = router;