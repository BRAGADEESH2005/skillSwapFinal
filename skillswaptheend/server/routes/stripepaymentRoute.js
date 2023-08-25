require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);  

router.post("/api/create-checkout-session", async (req, res) => {
    const { amount } = req.body;
    console.log("came in to pay create checkout session")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr", // Update currency as needed
            product_data: {
              name: "Skill Coins Purchase",
            },
            unit_amount: 10 * 100, // Convert to cents
          },
          quantity: amount/10,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/skill-coins/success",
      cancel_url: "http://localhost:3000/skill-coins/cancel",
    });
    console.log("session create after seeion is",session)
  
     // Here, you would typically store session.id (payment intent ID), session.payment_intent (charge ID), and other relevant data
    // You can use a database model/schema to store this information
    console.log("session.charge id",session.payment_intent)
    res.json({ paymentIntentID:session.id,chargeID:session.payment_intent});
  });
  
  router.post("/api/payment-success", async(req, res) => {
    const { userID, skillCoinsQuantity, paymentIntentID, chargeID } = req.body;
  
    console.log("user id ",userID);
    console.log("skill coins ",skillCoinsQuantity);
    try {
      // Find the user document in the database using the userID
      const user = await User.findById(userID);
  
      // Update the user's skillCoins and payments array
      user.skillCoins += skillCoinsQuantity;
      user.payments.push({
        paymentIntentID,
        chargeID,
      });
  
      // Save the updated user document
      await user.save();
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating payment:", error);
      res.json({ success: false, error: "Error updating payment" });
    }
  });
  
  router.get('/api/skill-coins', async (req, res) => {
    console.log("loading for skill coins");
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
      const skillCoins = user.skillCoins;
  
  
      res.json({ message: 'successful get request in skillcoins', userID:decoded.userId,skillCoins });
   
      
    });
  });

  module.exports = router;