import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link,Navigate,useNavigate } from 'react-router-dom';
import "./Login.css"
import axios from "axios";


const Login =  ({setSkillCoins,setIsLoggedIn,uid,setUid,seturEmail}) => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate();

  const signInUser = (e) => {
    e.preventDefault()
    const getSkillCoins = async() => {
      try {
  
        // Send a POST request to your backend API to update user's balancei
        const response = await axios.post(`http://localhost:5000/api/get/skill-coins`, { email:email });
  
        if(response.data.error===""){
          setSkillCoins(response.data.skillCoins)
        localStorage.setItem("skillCoins",parseInt(response.data.skillCoins))

        }
      } catch (error) {
        console.error("Error updating payment:", error);
        setSkillCoins(0)
        localStorage.setItem("skillCoins",parseInt(0))
        console.log("An error occurred while updating payment. Please try again later.");
      }
    }
    getSkillCoins();


    const auth =  getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        setUid(userCredential.user.uid)
        seturEmail(email)
        console.log(userCredential)
        setIsLoggedIn(true)
        localStorage.setItem("email",email)
        localStorage.setItem("uid",userCredential.user.uid)
        nav("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
      });

  }

  return (
    <div className="form-container">
      <h1>Login page</h1>
      <br/>
      <form className="login-form" onSubmit={signInUser}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>

        <Link to="/signup">Signup</Link>
      </form>
    </div>
  )
}

export default Login
