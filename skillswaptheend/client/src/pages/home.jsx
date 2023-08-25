import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import {Link} from "react-router-dom"
import Footer from '../components/footer';
const Home = () => {
  return (
    <HomeContainer>
      <Navbar />
      <ContentContainer>
        <Heading>Welcome to Skill Swap</Heading>
        <Description>
          Skill Swap is a vibrant community where you can unleash your potential
          and collaborate with experts. We believe in exchanging skills,
          empowering individuals, and fostering personal growth.
        </Description>
        <ButtonContainer>
        <StyledLink to="/dashboard">Get Started</StyledLink>
        </ButtonContainer>
      </ContentContainer>
      <Footer></Footer>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  padding: 50px 0;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 150px auto;
  max-width: 800px;
`;

const Heading = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const StyledLink = styled(Link)`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 14px 40px;
  font-size: 18px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;







export default Home;
