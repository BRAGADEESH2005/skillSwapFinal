import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import styled, { keyframes } from 'styled-components';
// import {swapRequest} from "./functions/commonFunctions"

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [feed, setFeed] = useState([]);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5000/api";
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    setLoading(true)
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

        if (response.status === 404){
          navigate("/register");
        }

        if (response.data.error === "not filled details") {
          navigate("/p");
        }
        setUser(response.data.user);
        setFeed(response.data.feed);
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  
  return (
    loading ?
    <div>
      <CustomLoader>
  <LoaderSpinner />
</CustomLoader>
    </div>
    :
    (<DashboardContainer>
    <SubNavbar>
      <div>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/user/chat">Chats</NavLink>
        <NavLink to={`/user/${user._id}`}>View Profile</NavLink>
        <NavLink to="/leaderboard">LeaderBoard</NavLink>
        <NavLink to="/skill-coins">Skill Coins</NavLink>
      </div>
      <div>
        
        <LogoutLink to="/logout">Logout</LogoutLink>
      </div>
    </SubNavbar>
    <BannerContainer>
  <BannerText>Welcome, {user.name}!</BannerText>
  <UserInfo>Email: {user.email}</UserInfo>
</BannerContainer>
    <FeedContainer>
      <h3>Feed:</h3>
      {feed.map((feedUser) => (
        <UserDetails key={feedUser._id}>
          <p>Name: {feedUser.name}</p>
          <SkillsList>
            <p>Skills Known:</p>
            <ul>
              {feedUser.skillsKnown.map((skill, index) => (
                <li key={index}>{skill.category}: {skill.skill}</li>
              ))}
            </ul>
          </SkillsList>
          <SkillsList>
            <p>Skills Required:</p>
            <ul>
                {console.log("skilssss reqq---",feedUser.skillsRequired)}
              {feedUser.skillsRequired.map((skill, index) => (
                <li key={index}>{skill.category}: {skill.skill}</li>
              ))}
            </ul>
          </SkillsList>
          <ActionButtons>
            <ProfileButton to={`/user/${feedUser._id}`}>View Profile</ProfileButton>
            {/* <SwapButton onClick={(e) => {swapRequest(feedUser._id,user._id)}}>Swap</SwapButton> */}
          </ActionButtons>
        </UserDetails>
      ))}
    </FeedContainer>
  </DashboardContainer>)
);
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SubNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 10px 0;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const NavLink = styled(Link)`
  color: #333;
  margin: 0 20px;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;


const BannerContainer = styled.div`
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease;
  text-align: center;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const BannerText = styled.h1`
  color: #333;
  font-size: 28px;
  margin: 0;
`;

const UserInfo = styled.div`
  margin-top: 10px;
  color: #666;
  font-size: 18px;
`
const FeedContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const UserDetails = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;

const SkillsList = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
  }

  li {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ProfileButton = styled(Link)`
  padding: 5px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LogoutLink = styled(Link)`
  display: block;
  text-align: center;
  background-color: #ff6347;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff6347;
  }
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
  

export default Dashboard;
