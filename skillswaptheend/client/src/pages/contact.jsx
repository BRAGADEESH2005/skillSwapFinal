import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import axios from 'axios';
import Footer from '../components/footer';


const ContactUs = () => {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [msg,setMsg]=useState("");
  const apiUrl = "http://localhost:5000/api";

  const handleSubmit = async (event) => {
    event.preventDefault()
        try {
          if (name !== "" && email !== "" && msg !== ""){
          const response = await axios.post(`${apiUrl}/contact-mail`, { name, email, msg });
          if (response.data.error){
           alert(response.data.error);
        }}
        } catch (error) {
          if (error.response.status === 409) {
            alert('Email already exists');
          } else {
            console.error('Error during registration:', error);
            alert('Registration failed');
          }
        }
        window.location.reload();
      };


  return (
    <>
    <ContactContainer>
      <Navbar />
      <Heading>Contact Us</Heading>
      <ContactForm onSubmit={handleSubmit}>
        <Input
         onChange={e => setName(e.target.value)}
          value={name}
           type="text" 
           placeholder="Your Name" 
           required/>
        <Input
        onChange={e => setEmail(e.target.value)}
          value={email} 
          type="email" 
          placeholder="Your Email" 
          required />
        <TextArea 
        onChange={e => setMsg(e.target.value)}
          value={msg}
        placeholder="Your Message" 
        rows="6" 
        required />
        <Button type='submit' value = 'submit'>Send Message</Button>
      </ContactForm>

    </ContactContainer>
     <Footer/>
</>
  );
};
const ContactContainer = styled.div`
  min-height:80vh;
  padding: 20px;
  background-color: #f9f9f9;
  color: #333;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  margin-top:100px;

`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default ContactUs;
