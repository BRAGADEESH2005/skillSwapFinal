require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
    }
  });

router.post("/api/forgot-password",async (req,res)=>{
    const {email}= req.body;
    console.log(email);
    try{
    const user =await User.findOne({email:email});
    console.log("Line 701 user",user);
    if (user){
      const newToken = crypto.randomBytes(20).toString('hex');
      console.log("New Tokennnnn",newToken);
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { 'resetToken.token': newToken },
        { new: true } // Return the updated document
      );
      console.log("Line 709 updated user",updatedUser)
      if(updatedUser){
          // Send the reset email
    const resetLink = `http://localhost:3000/reset-password/${newToken}`;
    const mailOptions = {
      from: "bragatheboss05@gmail.com",
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(200).json({ message: "Failed to dens mail",error:error});
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Email sent successfully',error:`The mail has been sent to ${email}.Follow the mail to update your password`});
    });
      }
    
      
    }else{
      return res.status(200).json({ message:"failed",error:"User does not exist"});
    }}catch(err){
      console.log("ERROR IN MAIL:",err)
      return res.status(200).json({ message:"failed",error:err});
    }
  });

  router.post("/api/send-mail",(req,res)=>{
    const {email,me}= req.body;
    const mailOptions = {
      from: "bragatheboss05@gmail.com",
      to: email,
      subject: 'Skill Swap Room ID',
      text: `This is your Meeting Id <strong>${me}</strong> Copy and place this Id in the chat user interface `,
    };
    console.log(email,"----",me,"----","Insideee maillll")
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(200).json({ message: "Failed to send mail",error:error});
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Email sent successfully',error:`The mail has been sent to ${email} Make sure You are not moving out of this page until the meet ends.If you move out you will be assigned a new id `});
    });
  })

  router.post("/api/contact-mail",(req,res)=>{
    console.log("contact ussss")
    const {name,email,msg}=req.body;
    console.log(name,email,msg)
    const mailOptions = {
      from: "bragatheboss05@gmail.com",
      to: "bragadeesh2005@gmail.com",
      subject: 'User Contact',
      text: `Name:${name},Email:${email},Text:${msg} `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(200).json({ message: "Failed to send mail",error:error});
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Email sent successfully',error:`The mail has been sent successfully `});
    });
  })

  module.exports = router;