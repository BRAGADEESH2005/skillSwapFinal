import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import styled, { keyframes } from 'styled-components';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // Use useState instead of useEffect
  const [notifiers, setNotifiers] = useState([]); // Use useState instead of useEffect
  const [userID, setUserID] = useState({}); // Use useState instead of useEffect
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5000/api";
  const [loading,setLoading]=useState(true);

  const fetchNotifications = async () => { // Wrap the asynchronous function inside useEffect
    setLoading(true);
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
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error !== "") {
        navigate("/p");
      }
      setNotifications(response.data.notifications);
      setNotifiers(response.data.notifiers);
      setUserID(response.data._id)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };
  useEffect(() => {
   

    fetchNotifications();
  }, [navigate]); // Add navigate to the dependency array

  const acceptUser = async(userID,feedID) => {
    console.log("fid ", feedID," uid ",userID);
    try {

      // Make a request to the backend with the JWT token in the Authorization header
      const PLNotification = notifiers.map((notifier,index)=>{
        if(notifier._id === feedID){
          console.log("feedddd-------------=========",notifier._id)
          return notifications[index]
        }
      })
      console.log("pllll",PLNotification);

      const response = await axios.post(`${apiUrl}/accept-swap`, {feedID,userID,learnSkill:PLNotification[0].learnSkill})
      if(response.data.error === ""){
        console.log("swap grant successfully sent from front end ")
      }else{
        console.log("error in sending swap grant from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap grant :', error);
    }
    fetchNotifications();

  }
  const rejectUser = async(userID,feedID) => {
    console.log("fid ", feedID," uid ",userID);
    try {

      // Make a request to the backend with the JWT token in the Authorization header
      const response = await axios.post(`${apiUrl}/reject-swap`, {feedID,userID});
      if(response.data.error === ""){
        console.log("swap reject successfully sent from front end ")
      }else{
        console.log("error in sending swap reject from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap reject :', error);
    }
    fetchNotifications();

  }

  const acceptPayUser =async (userID,feedID)=>{
    console.log("fid ", feedID," uid ",userID);
    try {

      // Make a request to the backend with the JWT token in the Authorization header
      const PLNotification = notifiers.map((notifier,index)=>{
        if(notifier._id === feedID){
          console.log("feedddd-------------=========",notifier._id)
          return notifications[index]
        }
      })
      console.log("pllll",PLNotification);

      const response = await axios.post(`${apiUrl}/accept-pay`, {feedID,userID,learnSkill:PLNotification[0].learnSkill})
      if(response.data.error === ""){
        console.log("swap grant successfully sent from front end ")
      }else{
        console.log("error in sending swap grant from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap grant :', error);
    }
    fetchNotifications();
  }
  const handleFinalPay=async (userID,feedID,learnSkill)=>{
    console.log("Clickedddd handle final payyy");

    
    try {
      const response = await axios.post (`${apiUrl}/detect-skill-coins`,{userID:userID,feedID:feedID});
      if(response.data.error === ""){
        console.log("skill coins updated successfully ")

        const chat_response =await axios.post (`${apiUrl}/accept-swap`,{userID:userID,feedID:feedID,learnSkill:learnSkill,preachSkill:null});

      }
      else if(response.data.error !== ""){
        alert(response.data.error);
      }else{
        console.log("error in sending swap grant from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap grant :', error);
    }
    fetchNotifications();

  }

  return (
    loading ?
    <div>
      <CustomLoader>
  <LoaderSpinner />
</CustomLoader>
    </div>
    :

    (
    <NotificationsContainer>
      <BackButton to="/dashboard">Back</BackButton>
      
    <NotificationsTitle>Notifications</NotificationsTitle>
    <NotificationsList>
      {notifications.length === 0 ? (
        <NotificationItem >
          <p>No notifications</p>
        </NotificationItem>
      ) : (
        notifications.map((notification, index) => (
          <NotificationItem key={index}>
            {notification.type === "swap-request" && (
              <>
                <p>{notification.type}</p>
                <p>{notifiers[index].name}</p>
                <p>PREACH SKILL: {notification.preachSkill.skill} [{notification.preachSkill.category}]</p>
                <p>LEARN SKILL: {notification.learnSkill.skill} [{notification.learnSkill.category}]</p>
                <NotificationButtonGroup>
                  <NotificationButton onClick={() => acceptUser(userID, notifiers[index]._id)}>Accept</NotificationButton>
                  <NotificationButton onClick={() => rejectUser(userID, notifiers[index]._id)}>Reject</NotificationButton>
                  <Link to={`/user/${notifiers[index]._id}`}>View Profile</Link>
                </NotificationButtonGroup>
              </>
            )}
            {/* Add similar sections for other notification types */}
            {notification.type === "pay-request" && notification.learnSkill && (
  <NotificationContainer>
    <NotificationHeader>Pay Request</NotificationHeader>
    <NotificationDetails>
      <p>PREACH SKILL: {notification.learnSkill.skill} [{notification.learnSkill.category}]</p>
      <ButtonContainer>
        <StyledButton onClick={() => acceptPayUser(userID, notifiers[index]._id)}>Accept</StyledButton>
        <StyledButton onClick={() => rejectUser(userID, notifiers[index]._id)}>Reject</StyledButton>
        <StyledLink to={`/user/${notifiers[index]._id}`}>View Profile</StyledLink>
      </ButtonContainer>
    </NotificationDetails>
  </NotificationContainer>
)}

{notification.type === "Accepted-Pay" && notification.learnSkill && (
  <NotificationContainer>
    <NotificationHeader>Accepted Pay Request</NotificationHeader>
    <NotificationDetails>
      <p>LEARN SKILL: {notification.learnSkill.skill} [{notification.learnSkill.category}]</p>
      <ButtonContainer>
        <StyledButton onClick={() => handleFinalPay(userID, notifiers[index]._id, notification.learnSkill)}>
          Pay
        </StyledButton>
        <StyledButton onClick={() => rejectUser(userID, notifiers[index]._id)}>Reject</StyledButton>
      </ButtonContainer>
    </NotificationDetails>
  </NotificationContainer>
)}
          </NotificationItem>
          
        ))
      )}
    </NotificationsList>
  </NotificationsContainer>)
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NotificationsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

//loader
const CustomLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoaderSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NotificationsTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const NotificationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotificationItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const NotificationButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const NotificationButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const NotificationContainer = styled.div`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
`;

const NotificationHeader = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #3498db;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  background-color: #2e4052;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }
`;

export default Notifications;
