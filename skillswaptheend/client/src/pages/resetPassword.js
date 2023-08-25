import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from 'react-router-dom';
import styled from "styled-components";

export default function ResetPassword(){
    const [allowed,setAllowed]=useState(false);
    const [newPassword,setNewPassword]=useState("");
    const apiUrl = "http://localhost:5000/api";
    const navigate = useNavigate();
    const {newtoken}=useParams();
    useEffect(() => {
        const fetchResetToken = async () => {
          try {
            const response = await axios.post(`${apiUrl}/reset-password`, { newtoken: newtoken });
            if (response.data.error === "") {
              console.log("Inside reset password ---allowed");
              setAllowed(true);
            } else {
              console.log("Not a valid token in reset password");
            }
          } catch (error) {
            console.error("Error resetting password:", error.message);
          }
        };
      
        fetchResetToken(); // Call the async function immediately
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

const handlePasswordReset =async()=>{
            if (newPassword !==""){
            const response = await axios.post(`${apiUrl}/update-password`,{newtoken:newtoken,password:newPassword});
            if (response.data.error === ""){
                alert("Password Updated");
                navigate("/login");
            }
            }else{
                setAllowed(false);
            }
}

return (
  <StyledContainer>
  {allowed ? (
    <div>
      <StyledTitle>Reset Your Password</StyledTitle>
      <StyledInput
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <StyledButton onClick={handlePasswordReset}>Reset Password</StyledButton>
    </div>
  ) : (
    <StyledMessage>You are not able to reset your password</StyledMessage>
  )}
</StyledContainer>
  );
  

}
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StyledTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3498db;
  }
`;

const StyledButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const StyledMessage = styled.p`
  font-size: 16px;
  color: #888;
`;