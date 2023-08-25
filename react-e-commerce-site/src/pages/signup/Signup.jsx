import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase/firebase';
import { Link ,useNavigate} from 'react-router-dom';
import "./Signup.css"
import axios from "axios";

const Signup = ({setSkillCoins,setIsLoggedIn,uid,setUid,seturEmail}) => {

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate();


  const signUpUser = (e) => {
    e.preventDefault()

    const auth =  getAuth();
    const getSkillCoins = async() => {
      try {
  
        // Send a POST request to your backend API to update user's balance
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

    const addUser = async (email, name, password) => {
      try {
        const userRef = db.collection('users').doc();
        const userDetails = {
          email: email,
          name: name,
          password: password,
          cartItems:[],
          orderedItems:[],
          skillCoins:0
        };

        await userRef.set(userDetails);
        console.log('User added to Firestore successfully!');
      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }
    };


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        getSkillCoins();
        addUser(email,username,password)
        seturEmail(email)
        setUid(userCredential.user.uid)
        localStorage.setItem("email",email)
        localStorage.setItem("uid",userCredential.user.uid)
        setIsLoggedIn(true)
        nav("/")

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
      });

  }

  return (
    <div className='form-container'>
      <h1>Sign up</h1>
      <br/>
      <form onSubmit={signUpUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor='email'>email</label>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor='password'>password</label>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Sign up</button>

        <Link to='/login'>login</Link>
      </form>
    </div>
  )
}

export default Signup