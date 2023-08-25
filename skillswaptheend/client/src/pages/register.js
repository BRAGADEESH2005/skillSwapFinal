import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import styled from "styled-components";
import {Link} from "react-router-dom";
import Footer from '../components/footer';

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

function Register() {
  let apiUrl = "http://localhost:5000/api";

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  
  const navigate = useNavigate(); 
  const handleRegister = async (event) => {
    event.preventDefault()
        try {
          const response = await axios.post(`${apiUrl}/register`, { name, email, password });
          console.log(response.data.token)
          if (response.data.token){
            localStorage.setItem('jwt', response.data.token);
            navigate('/p');
        }
        } catch (error) {
          if (error.response.status === 409) {
            alert('Username already exists');
          } else {
            console.error('Error during registration:', error);
            alert('Registration failed');
          }
        }
      };

  return (
    <div>
      <Navbar />
      <Container>
      <h1>Register here!!</h1>
      <Form onSubmit={handleRegister}>
        <Input 
          onChange={e => setName(e.target.value)}
          value={name}
          type="text" 
          placeholder="Username" 
          required
        />
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
        <SubmitButton type="submit" value="Register" />
        <Link to="/login">Already Registered</Link>
      </Form>

    </Container>    
    <Footer/>

    </div>
    
  );
}

export default Register;



// function handleSubmit(event){
  //   event.preventDefault()
  //   fetch("http://localhost:5000/register",{
  //     method:"POST",
  //      headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name, email, password }),
  //   })
  // }