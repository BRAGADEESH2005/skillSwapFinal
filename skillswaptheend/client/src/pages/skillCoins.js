//pk_test_51NeK18SCNDOIGjztTERH4Ow1UwOfTy1OKieHLvVn3gHdMJyrhymax6hsA6dVoteWgA0GnYtqajxij7zZyVNEBlwJ00keKB9Q5T

import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';

function SkillCoins() {
  const [amount, setAmount] = useState(0); // State to store the entered amount
  const apiUrl = "http://localhost:5000/api";
  const [userID,setUserID] = useState("");
  const [skillCoins,setSkillCoins] = useState(null);
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);


  useEffect(() => {
    setLoading(true)
    const fetchUserDetails = async () => {
      try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('jwt');
        if (!token) {
          // Handle the case where the token is not present
          console.error('JWT token not found in localStorage');
          navigate("/register");
          return;
        }

        // Make a request to the backend with the JWT token in the Authorization header
        const response = await axios.get(`${apiUrl}/skill-coins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.error === "not filled details") {
          navigate("/p");
        }
        setUserID(response.data.userID);
        setSkillCoins(response.data.skillCoins);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handlePaymentSuccess = async (paymentIntentID, chargeID) => {
    try {
      const skillCoinsQuantity = Math.floor(parseFloat(amount) / 10);

      // Send a POST request to your backend API to update user's balance
      const response = await fetch("http://localhost:5000/api/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, skillCoinsQuantity,paymentIntentID, chargeID }), // Convert amount to a floating-point number
      });
      const result = await response.json();

      if (result.success) {
        // Payment update was successful
        console.log("Payment successful! Skill coins balance updated.");
      } else {
        // Payment update failed
        console.log("Payment update failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      console.log("An error occurred while updating payment. Please try again later.");
    }
  };

  const makePayment = async () => {
    console.log("came inside make payment")
    const stripe = await loadStripe("pk_test_51NeK18SCNDOIGjztTERH4Ow1UwOfTy1OKieHLvVn3gHdMJyrhymax6hsA6dVoteWgA0GnYtqajxij7zZyVNEBlwJ00keKB9Q5T");
    console.log("afeter stripe load")
    if(amount > 0 && amount %10 === 0){
    const body = { amount }; // Use the entered amount
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "http://localhost:5000/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
      
    const session = await response.json();


    const result = stripe.redirectToCheckout({
      sessionId: session.paymentIntentID,
    });
    console.log("result",result);
    if (result.error) {
      console.log(result.error);
    } else {
      // Call handlePaymentSuccess after payment is successful
      handlePaymentSuccess(session.paymentIntentID,session.chargeID);
    }}else{
      alert("Please enter the amount as a multiples of 10");
    }
  };

  return (
    loading ?
    <div>
      <CustomLoader>
  <LoaderSpinner />
</CustomLoader>
    </div>
    :
    (
    <>
    
    <StyledSkillCoinsPage>
    <StyledCard>
      <StyledBackButton to="/dashboard">Back</StyledBackButton>
      <StyledAboutButton to="/skill-coins/rules">About Skill Coins</StyledAboutButton>
      <h3>Your balance: {skillCoins} skill coins</h3>
      <StyledCardBody>
        <h4>Enter Amount for Skill Coins:</h4>
        <h5>Currently the price of a single SkillCoin is Rs.10</h5>
        <StyledInput
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <StyledButton to="#" onClick={makePayment}>Pay with Stripe</StyledButton>
      </StyledCardBody>
    </StyledCard>
    <CustomPurchaseLink href="http://localhost:3001" target="_blank">Custom Purchase Link</CustomPurchaseLink>
  </StyledSkillCoinsPage>
    </>)

  );
}

const StyledSkillCoinsPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const StyledCard = styled.div`
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
`;

const StyledCardBody = styled.div`
  margin-top: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const StyledButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: black;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
`;

const CustomPurchaseLink = styled.a`
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
`;

const StyledBackButton = styled(StyledButton)`
  background-color: #dc3545;
`;

const StyledAboutButton = styled(StyledButton)`
  background-color: #007bff;
`;


//loader
const CustomLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoaderSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
export default SkillCoins;
