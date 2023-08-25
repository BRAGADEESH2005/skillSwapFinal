import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import { useSpring, animated } from 'react-spring';
import Footer from '../components/footer';

const AboutUs = () => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <Wrapper>
      <Navbar />
      <AnimatedAboutContainer style={fadeIn}>
        <Heading>About Us</Heading>
        <Description>
          Founded by a group of dedicated Computer Science major students, Skill Swap
          is driven by the vision to create a platform that redefines online learning
          and skill sharing. Our mission is to connect learners worldwide and empower
          them to unlock their potential through collaborative learning.
        </Description>
      </AnimatedAboutContainer>
     <Footer/>

    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f9f9f9;
`;

const AnimatedAboutContainer = styled(animated.div)`
min-height:50vh;
  padding: 40px 20px;
  background-color: white;
  color: #333;
  text-align: center;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
  margin-top:100px;
  border-radius: 8px;
`;

const Heading = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #666;
`;

export default AboutUs;
