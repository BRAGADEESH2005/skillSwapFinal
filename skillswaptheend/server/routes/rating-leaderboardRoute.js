
const express = require("express");
const router = express.Router();
const User = require("../db");


router.post("/api/user/rating",async (req,res)=>{
    const {currentUserID,rating,receiverID} =req.body;
    console.log("idddddd,,,ratinggggggg",currentUserID,rating);
    try{
      const user = await User.findById(currentUserID)
      if(user){
          const prevRating = user.rating;
        console.log("previous Rating",prevRating);
      const newRating = ((prevRating.ratingValue)+rating)/((prevRating.ratingCount)+1);
      console.log("new reat",newRating)
      const newCount = (prevRating.ratingCount)+1;
      await User.updateOne(
        { _id: currentUserID, 'chats.user_id': receiverID },
        { $set: { 'chats.$.ratingGiven': true } }
      );
       User.updateOne({_id:currentUserID},{$set:{"rating.ratingValue":newRating,"rating.ratingCount":newCount}})
      .then(res=>{console.log("Sucessfulllll updateeeeeee",res)})
      .catch(err=>{console.log("errorrr in update",err)})
      res.status(200).json({message:"Successfull",error:""})
    }else{
      console.log("no user found in rating ghggggggggggggggggggggggggggg")
      res.status(400).json({message:"UserNotFound",error:"User not found"})
    }
    }catch(err){
      console.log("Error--:",err);
      res.status(404).json({message:"Not Successfull",error:"Failed to update rating"})
    }
})


router.get('/api/leaderboard', (req, res) => {
  console.log("Inside Leaderboard");

  User.find({}, '_id name rating.ratingValue')
    .sort({ 'rating.ratingValue': -1 })
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching leaderboard data:', err);
      return res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;