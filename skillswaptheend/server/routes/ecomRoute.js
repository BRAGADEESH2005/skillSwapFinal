
const express = require("express");
const router = express.Router();
const User = require("../db");

 router.post("/api/get/skill-coins",async (req,res)=>{
 
    const {email}=req.body;
    try{
    const user =await  User.find({email:email});
    if (user[0]){
      const coins = user[0].skillCoins;
      console.log("user[0]",user[0])
      console.log("user[0]r Skilscoins",coins)
      res.status(200).json({message:"Success",error:"",skillCoins:coins})
    }
    else{
      res.status(500).json({message:"NotFound",error:"User Not Found"})
    }
    }catch(err){
      console.log(err);
      res.status(500).json({message:"NotFound",error:"User Not Found"});
    }
  })
  
  router.post("/api/set/skill-coins",async (req,res)=>{
    const {email,skillCoins}=req.body;
    try{
    const response = await User.findOneAndUpdate({email:email}, { skillCoins: skillCoins  });
  
  console.log("updated" ,response) 
      // console.log("userr Skils",user.skillCoins)
      res.status(200).json({message:"Success",error:""})
  
    }catch(err){
      console.log(err);
      res.status(500).json({message:"NotFound",error:"User Not Found"});
    }
  })

  module.exports = router;