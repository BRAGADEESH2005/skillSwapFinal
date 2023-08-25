import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const PaymentFailure = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/skill-coins'); 
    }
  }, [countdown, navigate]);

  return (
    <Container>
      <Message>
        <Title>Payment Failure!</Title>
        <Description>There is an issue in your payment process</Description>
      </Message>
      <Countdown>
        <Timer>Navigating to another page in {countdown} seconds...</Timer>
      </Countdown>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Message = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
`;

const Countdown = styled.div``;

const Timer = styled.p`
  font-size: 1rem;
`;

export default PaymentFailure;
