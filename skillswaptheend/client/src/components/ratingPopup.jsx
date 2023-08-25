// import React, { useState } from 'react';
// import styled from 'styled-components';

// const RatingPopup = ({ onClose ,feedID,userID }) => {
//   const [rating, setRating] = useState(0);

//   const handleRatingChange = (newRating) => {
//     setRating(newRating);
//   };

//   const rateHandleFormSubmit = (e) => {
//     e.preventDefault();
//     if (rating >= 1 && rating <= 5) {
//     //   onSubmit(rating);
//     }
//   };

//   return (
//     <PopupContainer>
//       <PopupContent>
//         <CloseButton onClick={onClose}>X</CloseButton>
//         <Title>Rate Your Experience</Title>
//         <StarsContainer>
//           {[1, 2, 3, 4, 5].map((value) => (
//             <StarIcon
//               key={value}
//               selected={value <= rating}
//               onClick={() => handleRatingChange(value)}
//             >
//               ★
//             </StarIcon>
//           ))}
//         </StarsContainer>
//         <SubmitButton onClick={rateHandleFormSubmit}>Submit Rating</SubmitButton>
//       </PopupContent>
//     </PopupContainer>
//   );
// };

// const PopupContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const PopupContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//   text-align: center;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: none;
//   border: none;
//   font-size: 20px;
//   cursor: pointer;
// `;

// const Title = styled.h2`
//   margin-bottom: 20px;
// `;

// const StarsContainer = styled.div`
//   display: flex;
//   justify-content: center;
// `;

// const StarIcon = styled.span`
//   font-size: 30px;
//   color: ${(props) => (props.selected ? 'gold' : 'gray')};
//   cursor: pointer;
// `;

// const SubmitButton = styled.button`
//   background-color: #007bff;
//   color: #fff;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: background-color 0.3s;
//   margin-top: 20px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// export default RatingPopup;
