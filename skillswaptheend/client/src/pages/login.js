import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from '../components/footer';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
  background-color: #f2f2f2;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
function Login() {

  let apiUrl = "http://localhost:5000/api";
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const navigate = useNavigate(); 


    const handleLogin = async (event) => {
      event.preventDefault()
        try {
          const response = await axios.post(`${apiUrl}/login`, { email, password });
          const token = response.data.token;
          if (token) {
            localStorage.setItem('jwt', token);
            navigate('/dashboard');
          } else {
            alert('Wrong email or password');
          }
          
        } catch (error) {
          console.error('Error during login:', error);
          alert('Wrong Email or password');
        }
      };

      const handleForgetPassword=async ()=>{
        if (email === ""){
          alert("Please enter the email and click the forget password");
        }else{
        const response = await axios.post(`${apiUrl}/forgot-password`,{email:email});
          alert(response.data.error);
      }
      }

  return (
      <div>
      <Navbar />
     <Container>
      
     <h1>Login here!!</h1>
     <Form onSubmit={handleLogin}>
       <Input
         onChange={e => setEmail(e.target.value)}
         value={email}
         type="email"
         placeholder="Email"
         required
       />
       <Input
         onChange={e => setPassword(e.target.value)}
         value={password}
         type="password"
         placeholder="Password"
         required
       />
       <SubmitButton type="submit" value="Login" />
       <button onClick={handleForgetPassword}>Forget password </button>
       <br/>
        <Link to="/register">New User</Link>
     </Form>
   </Container>
   <Footer/>

   </div>
  );
}

export default Login;



  // async function handleLogin(event){
  //   event.preventDefault();

  //   const requestOptions = {
  //     method:"POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email, password }),
  //   };

    
  //  const response = fetch("http://localhost:5000/login",requestOptions)
  //  const data = await response.json()

  //   if (data.user){
  //     alert("Login Successfull")
  //     window.location.href="/credential"
  //   }else{
  //     alert("Wrong Username or password")
  //   }
  // }