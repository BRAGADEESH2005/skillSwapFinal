require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY; 


router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      const token = jwt.sign({ userId: user._id }, secretKey);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to authenticate' });
    }
  });

module.exports = router;