import axios from "axios";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const ChatUsers = () => {
  const apiUrl = "http://localhost:5000/api";
  const navigate = useNavigate();
  const [userNameIdList, setUserNameIdList] = useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          console.error('JWT token not found in localStorage');
          navigate("/register");
          return;
        }

        const response = await axios.get(`${apiUrl}/user/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.error === "not filled details") {
          navigate("/p");
        }
        
        setUserNameIdList(response.data.userNameIdList);
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
    (
    <ChatUsersContainer>
      <BackButton to="/dashboard">Back</BackButton>
      {userNameIdList.length > 0 ? (
        <UserList>
          {userNameIdList.map((user, index) => (
            <UserListItem key={index}>
              <UserProfileImage src={user.image} alt="profile pic" />
              <UserNameLink to={`/user/chat/${user._id}`}>{user.name}</UserNameLink>
            </UserListItem>
          ))}
        </UserList>
      ) : (
        <NoChatsMessage>No Chats</NoChatsMessage>
      )}
    </ChatUsersContainer>)
  );
}

export default ChatUsers;

const ChatUsersContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: block;
  margin-bottom: 20px;
  color: blue;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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

const UserProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserNameLink = styled(Link)`
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NoChatsMessage = styled.p`
  text-align: center;
  font-style: italic;
  color: gray;
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
