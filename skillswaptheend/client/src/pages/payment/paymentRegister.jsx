import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const RegisterPage = ({userID}) => {
  const stripe = useStripe();
  const elements = useElements();



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (token) {
      try {
        const response = await axios.post('/api/register/card-details', {
          userID,
          stripeToken: token.id,
        });

        if (response.status === 201) {
          console.log('User registered successfully');
          // Navigate to another page or show a success message here
        }
      } catch (error) {
        console.error('Error registering user:', error);
        // Handle the error, show an error message to the user
      }
    } else {
      console.error('Error creating token:', error);
      // Handle the error, show an error message to the user
    }
  };

  return (
    <div>
      <h1>Register Card Details</h1>
      <div>
        <label>Card Details:</label>
        <CardElement />
      </div>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default RegisterPage;
