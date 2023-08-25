require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const DBURL = process.env.DBURL;

//Routes
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute")
const chatRoute = require("./routes/chatRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const profiledetailsRoute = require("./routes/profiledetailsRoute");
const viewprofileRoute = require("./routes/viewprofileRoute");
const swapRoute = require("./routes/swapRoute");
const notificationRoute = require("./routes/notificationRoute");
const sendmessageRoute = require("./routes/sendmessageRoute");
const finishRoute = require("./routes/finishRoute");
const reportRoute = require("./routes/reportRoute");
const ratingLeaderboardRoute = require("./routes/rating-leaderboardRoute");
const forgotpasswordRoute = require("./routes/forgotpasswordRoute");
const resetUpdatePasswordRoute = require("./routes/reset-updatepasswordRoute");
const stripePaymentRoute = require("./routes/stripepaymentRoute");
const userPaymentRoute = require("./routes/userpaymentRoute");
const detectSkillcoinsRoute = require("./routes/detect-skillcoinsRoute");
const ecomRoute = require("./routes/ecomRoute");

// Middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
// }));
app.use(cors());


mongoose.connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


//Register Route
app.use(registerRoute);

//Login Route
app.use(loginRoute);

//retrieving chat , Chats list interface 
app.use(chatRoute);

//Dashboard Route
app.use(dashboardRoute);

//Profile Details Route
app.use(profiledetailsRoute);

//View Profile Route
app.use(viewprofileRoute);

// Swap reqqq, accept-swap,rejectswap,swap-form
app.use(swapRoute);

//Notification Route
app.use(notificationRoute);

//Send - message Route
app.use(sendmessageRoute);

//Finish Chat
app.use(finishRoute);

// Report Journey Route
app.use(reportRoute);

//rating leaderboard route
app.use(ratingLeaderboardRoute);

//forgot password and send mail
app.use(forgotpasswordRoute);

//reset-update password
app.use(resetUpdatePasswordRoute);

//Stripe payments
app.use(stripePaymentRoute);

// Payment and pay req accept 
app.use(userPaymentRoute);

//detect skill coins
app.use(detectSkillcoinsRoute);

//ecom Route
app.use(ecomRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


