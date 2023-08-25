const express = require("express");
const router = express.Router();
const User = require("../db");

router.get("/api/profiledetails",(req,res)=>{
    const {user_id} = req.body;
    try{
      const user = User.findById(user_id);
      if (user){
        res.status(200).json({message:"Success",gender:user.gender,languages:user.languages,skillsKnown:user.skillsKnown,skillsRequired:user.skillsRequired,image:user.image,amount:user.amount,days:user.days,error:""})
      }
    }catch(err){
      res.status(500).json({error:"Error in user"})
    }
  
  })
  
  
router.post("/api/profileDetails",(req,res)=>{
    const{user_id,gender,selectedLanguages,skillsKnown,skillsRequired,image,amount,days} = req.body;
    const updatedFields ={
      gender:gender,
      languages:selectedLanguages,
      skillsKnown:skillsKnown,
      skillsRequired:skillsRequired,
      image:image,
      amount:amount,
      days:days
  
    }
    User.findOneAndUpdate({_id:user_id},updatedFields)
    .then((response)=>{
      console.log("Data Added Successfully")
    })
    .catch(err => console.log(err))
    console.log("Details--------")
    console.log(user_id,gender,selectedLanguages,skillsKnown,skillsRequired)
    res.status(200).json({message:"successfully added profile details"});
  })

module.exports = router;