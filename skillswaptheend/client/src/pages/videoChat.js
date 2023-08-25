import React, { useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../components/VideoPlayer";
import VideoNotifications from "../components/VideoNotifications";
import VideoOptions from "../components/VideoOptions";
import { ContextProvider } from "../SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";



export default function VideoChat(){
    const navigate = useNavigate();
    const apiUrl = "http://localhost:5000/api";
    const { email,name } = useParams();

  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          // Retrieve the JWT token from localStorage
          const token = localStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not present
            console.error('JWT token not found in localStorage');
            navigate("/register");
            return;
          }
  
          // Make a request to the backend with the JWT token in the Authorization header
          const response = await axios.get(`${apiUrl}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.data.error === "not filled details") {
            navigate("/p");
          }
        } catch (error) {
          console.error('Failed to fetch user details video chattt:', error);
        }
      };
  
      fetchUserDetails();
    }, []);


    const goBack = () => {
        window.history.back();
      };


    return(
      <ContextProvider>
      <VideoChatContainer>
        <Heading>Video Chat</Heading>
        <VideoPlayer email={email} othername={name}/>
        <StyledVideoOptions email={email}>
          <VideoNotifications />
        </StyledVideoOptions>
        <BackButton onClick={goBack}>Back</BackButton>
      </VideoChatContainer>
    </ContextProvider>
    )
}
const VideoChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const BackButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const Heading = styled.p`
  font-size: 24px;
  margin-bottom: 20px;
`;

const StyledVideoOptions = styled(VideoOptions)`
  margin-top: 20px;
`;
