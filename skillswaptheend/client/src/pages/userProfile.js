import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams ,Link,useNavigate} from 'react-router-dom';
import styled from 'styled-components';
// import {swapRequest} from "./functions/commonFunctions"
import SkillSelectionPopup from "../components/skillsSelectPopup"

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const { userID } = useParams();
    const [swapDisable,setSwapDisable] = useState(false);
    const[openPopup,setOpenPopup]=useState(false);
    const [preachSkills,setPreachSkills]=useState([]);
    const [learnSkills,setLearnSkills] = useState([]);
    const [payment,setPayment] = useState(false);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    const apiUrl = "http://localhost:5000/api";

    useEffect(() => {
      setLoading(true);
        const apiUrl = "http://localhost:5000/api";
        const userDetail = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/${userID}`);
                if (response.status === 200) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        userDetail();
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
              setCurrentUser(response.data.user);
              setLoading(false);
             
            } catch (error) {
              console.error('Failed to fetch user details:', error);
            }
          };
      
          fetchUserDetails();
    
    }, [userID]);

   useEffect(() => {
    (currentUser.chats !== undefined && (currentUser.chats.forEach((chat) => {
        console.log("true1")

        if(chat.user_id === user._id){
            console.log("true")
            setSwapDisable(true);
        }
       })))
   },[currentUser]);

   const goBack = () => {
    window.history.back();
  };

   const swapSubmitHandler = async () => {
    try {
      const response = await axios.post(`${apiUrl}/user/swap/form`, {
        senderID: currentUser._id,
        receiverID: userID
      });
  
      if (response.data.error === "") {
        setPayment(false);
        setPreachSkills(response.data.preachSkills);
        setLearnSkills(response.data.learnSkills);
        setOpenPopup(!openPopup);
      }else{
        console.log("Error in fetching user and receiver skills")
      }
      return
    } catch (error) {
      // Handle error here
      console.error("Error:", error);
      return
    }
  };

  const handlePay =async ()=>{
    try {
      
        const response = await axios.post(`${apiUrl}/user/payment/form`, {
          senderID: currentUser._id,
          receiverID: userID
        });
    
        if (response.data.error === "") {
          setPreachSkills(response.data.preachSkills);
          setLearnSkills(response.data.learnSkills);
          setPayment(true);
          setOpenPopup(!openPopup);
        }else{
          console.log("Error in fetching user and receiver skills")
        }
        return
      } catch (error) {
        // Handle error here
        console.error("Error:", error);
        return
      }
  }
  
    return (
      loading ?
      <div>
        <CustomLoader>
    <LoaderSpinner />
  </CustomLoader>
      </div>
      :(
        <StyledProfileContainer>
        {user && (
          <>
            <ProfileImage src={user.image} alt="Profile Pic" />
            <ProfileInfo>
              <h1>{user.name}</h1>
              <SkillSection>
              <p>Gender: {user.gender}</p>

              </SkillSection>

              <SkillSection>
              <h3>Languages Known:</h3>
              {user.languages && user.languages.map((language, index) => (
                <p key={index}>{language}</p>
              ))}
              </SkillSection>
              <SkillSection>

              <h3>Skills Known</h3>
              {user.skillsKnown && (
                <ul>
                  {user.skillsKnown.map((skillK, index) => (
                    <li key={index}>{skillK.category}: {skillK.skill}</li>
                  ))}
                </ul>
              )}
              </SkillSection>
              <SkillSection>
              <h3>Skills Required</h3>
              {user.skillsKnown && (
                <ul>
                  {user.skillsRequired.map((skillK, index) => (
                    <li key={index}>{skillK.category}: {skillK.skill}</li>
                  ))}
                </ul>
              )}
              </SkillSection>
              <SkillSection>

              <h3>Completed Skills</h3>
              {user.completed_skills && (user.completed_skills.length === 0 ? (
                <p>No completed skills yet.</p>
              ) : (
                <ul>
                  {user.completed_skills.map((skillC, index) => (
                    <li key={index}>Skill: {skillC.skill} [{skillC.category}],<Link to={`/user/${skillC.mentor._id}`}> Mentor: {skillC.mentor.name}</Link></li>
                  ))}
                </ul>
              ))}
              </SkillSection>
              <SkillSection>

              <h3>Rating:</h3>
              {user.rating && (
                <p><b>{user.rating.ratingValue}/5</b> by {user.rating.ratingCount} users</p>
              )}
              </SkillSection>
              <SkillSection>
              <h3>Amount {user.amount} Skill Coins per course</h3>
              </SkillSection>

              <ButtonsContainer>
                <BackButton onClick={goBack}>Back</BackButton>
                {(currentUser._id === user._id) ? (
                  <ProfileButton to="/p">Edit Profile</ProfileButton>
                ) : (
                  swapDisable ? (
                    <DissabledSwapButton disabled>Swap</DissabledSwapButton>
                  ) : (
                    <>
                      <SwapButton onClick={swapSubmitHandler}>Swap</SwapButton>
                      <PayButton onClick={handlePay}>Pay</PayButton>
                    </>
                  )
                )}
                {openPopup && (
                  <SkillSelectionPopup
                    showpopup={openPopup}
                    preachSkills={preachSkills}
                    learnSkills={learnSkills}
                    payment={payment}
                    setOpenPopup={setOpenPopup}
                    onClose={() => setOpenPopup(false)}
                    feedID={user._id}
                    userID={currentUser._id}
                  />
                )}
              </ButtonsContainer>
            </ProfileInfo>
          </>
        )}
      </StyledProfileContainer>)
    );
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 10px;
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



const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 20px;
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

const SwapButton = styled.button`
  background-color: #c0392b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e74c3c;
  }
`;

const PayButton = styled.button`
  background-color: #2980b9;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3498db;
  }
`;

const DissabledSwapButton = styled.button`
  padding: 10px 20px;
  background-color: #ccc;
  color: #666;
  border: none;
  border-radius: 5px;
  cursor: not-allowed;
  opacity: 0.6;
  transition: background-color 0.3s, color 0.3s, opacity 0.3s;

  &:hover {
    background-color: #ccc;
  }
`;

const ProfileButton = styled(Link)`
  display: inline-block;
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 1px;
  border: 2px solid transparent;
  transition: background-color 0.3s ease, transform 0.2s ease, border-color 0.3s ease;

  &:hover {
    background-color: #2ecc71;
    transform: translateY(-2px);
    border-color: #27ae60;
  }
`;

const StyledProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const SkillSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const ProfileInfo = styled.div`
  text-align: left;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
    margin: 10px 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      font-size: 16px;
      margin: 5px 0;
    }
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }
`;

export default UserProfile;
