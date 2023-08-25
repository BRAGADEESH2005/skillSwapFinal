import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const ChatUser = () => {
  const apiUrl = "http://localhost:5000/api";
  const navigate = useNavigate();
  const [userChat, setUserChat] = useState({}); // Full Chat
  const [otherUser, setOtherUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isMessageSent,setIsMessageSent] = useState(false);
  const [socUserId, setSocUserId] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [isFinishing,setIsFinishing] = useState(false)
  const [ratingSubmitted,setRatingSubmitted] = useState(false)
  const [showPopUp,setShowPopUp]=useState(false);
  const [rating, setRating] = useState(0);
  const { chatUserID } = useParams();
  const [loading,setLoading]=useState(true);



  const socket = useRef();

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

            const response = await axios.get(`${apiUrl}/user/chat/${chatUserID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.error !== "") {
                console.log("error in chat user interface while fetching");
            }
            console.log("============================",response.data.error,"============================")
            if(response.data.error === "Chat not found"){
              console.log("navogate insideeeeeee")
              navigate("/user/chat")
            }
            setUserChat(response.data.chat);
            setOtherUser(response.data.otherUser);
            setSocUserId(response.data.user_id);
            setRatingSubmitted(response.data.chat.ratingGiven);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            navigate("/user/chat")

        }
    };

    fetchUserDetails();
}, [chatUserID, navigate]);

  useEffect(() => {
    const fetchData = async () => {
        // Establish a socket connection
        socket.current = io("http://localhost:8800");
        
        // Emit the user's ID to join the room
        socket.current.emit('new-user-add', socUserId);
        
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
        });


    };

    fetchData();
}, [socUserId]);


  useEffect(() => {
    if (Object.keys(userChat).length !== 0) {
      socket.current.emit("send-message", { message: newMessage, receiverId: chatUserID });
    }
  }, [isMessageSent, chatUserID]);

  useEffect(() => {

    

    if (receiveMessage !== null && receiveMessage.receiverId === socUserId && receiveMessage.message !== "") {
      setUserChat((prevUserChat) => ({
        ...prevUserChat,
        messages: [...prevUserChat.messages, {
          from_user: otherUser._id,
          to_user: socUserId,
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          message: receiveMessage.message,
        }],
      }));
    }
  }, [receiveMessage, socUserId]);

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  });

    //useeffect for updation user ui for himself 
    useEffect(() => {
      if(newMessage !== "" && isMessageSent){
        const newUserChat = {
          user_id: socUserId,
          messages: [
            ...userChat.messages,
            {
              from_user: socUserId,
              to_user: otherUser._id,
              timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              message: newMessage,
            },
          ],
          status: 'in_progress'
        }
        setUserChat(newUserChat)
      }
    },[newMessage,isMessageSent])

  const handleSendMessage = async () => {
    setIsMessageSent(true)
    try {
      let from_user_token = localStorage.getItem('jwt');

      const response = await axios.post(`${apiUrl}/user/${otherUser._id}/send-message`, { newMessage, from_user_token });

      if (response.data.error !== "") {
        console.log("error in sending message from front end");
      } else {
        console.log("successfully sent message front end");
      }
    } catch (error) {
      console.error('Error during sending message request:', error);
    }

    setTimeout(() => {
      setIsMessageSent(false);
      setNewMessage("");

    }, 1000); 
  };

  const isDifferentDate = (date1, date2) => {
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    return formattedDate1 !== formattedDate2;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const finishChatWithRating = async()=>{
    setShowPopUp(true);
}

const rateHandleFormSubmit = async (e) => {
  e.preventDefault();
  setShowPopUp(false);

  console.log("rateHandleFormSubmit")
  if (rating >= 0 && rating <= 5) {
  try {
    console.log("currentUserID",socUserId)
    const response = await axios.post(`${apiUrl}/user/rating`, { currentUserID:socUserId,rating:rating ,receiverID:chatUserID});

    if (response.data.error !== "") {
      console.log("successfully sent rating front end");
     
    } else {
      console.log("error in rating chat from front end");
    }
    setRatingSubmitted(true)

  } catch (error) {
    console.error('Error during sending rating request:', error);
  }
  
  finishChat();
  }
};

  const finishChat = async() => {
    setIsFinishing(!isFinishing);
     try {

      const response = await axios.post(`${apiUrl}/user/chat/finish/${otherUser._id}`, { currentUserID:socUserId });

      if (response.data.error !== "") {
        console.log("error in finishing chat from front end");
        if(response.data.ended === "true"){
          navigate("/user/chat")
        }
      } else {
        console.log("successfully sent finish front end");
      }
    } catch (error) {
      console.error('Error during sending finish request:', error);
    }
  }


  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };



  const reportChat = async() => {
    try {

     const response = await axios.post(`${apiUrl}/user/chat/report/${otherUser._id}`, { currentUserID:socUserId });

     if (response.data.error !== "") {
       console.log("error in reporting chat from front end");
     } else {
       console.log("successfully sent report front end");
     }
   } catch (error) {
     console.error('Error during sending report request:', error);
   }
 }
  return (
    loading ?
      <div>
        <CustomLoader>
    <LoaderSpinner />
  </CustomLoader>
      </div>
      :
    (<ChatContainer>
      <ChatHeader>
  <BackButton to={`/user/chat`}>Back</BackButton>
</ChatHeader>
      <UserProfile>
        <UserProfilePhoto src={otherUser.profilePhotoUrl} alt={`${otherUser.name}'s profile`} />
        <UserProfileName><Link to={`/user/${otherUser._id}`} style={{ textDecoration: 'none' }}>{otherUser.name}</Link></UserProfileName>
      </UserProfile>

<ButtonsContainer>


<VideoCallButton to={`/user/video-chat/${otherUser.email}/${otherUser.name}`}>
    {/* <VideoCallIcon /> */}
    Video Call
  </VideoCallButton>
{ratingSubmitted ? (
  <FinishButton onClick={finishChat}>
    {isFinishing ? "Finishing" : "Finish"}
  </FinishButton>
) : (
  <FinishButton onClick={finishChatWithRating}>
    {isFinishing ? "Finishing" : "Finish"}
  </FinishButton>)}
  <ReportButton onClick={reportChat}>Report</ReportButton>
  </ButtonsContainer>
      <MessageContainer>
      {userChat.messages &&
        userChat.messages.map((msg, index) => {
          if (index === 0 || isDifferentDate(msg.timestamp, userChat.messages[index - 1].timestamp)) {
            return (
              <div key={index}>
                <MessageDate>{formatDate(msg.timestamp)}</MessageDate>
               
                <Message fromother={(msg.to_user === otherUser._id).toString()}>
                  <b>{msg.message}</b>
                  <Timestamp>{formatTime(msg.timestamp)}</Timestamp>
                </Message>
              </div>
            );
          } else {
            return (
              <Message key={index} fromother={(msg.to_user === otherUser._id).toString()}>
                <b>{msg.message}</b>
                <Timestamp>{formatTime(msg.timestamp)}</Timestamp>
              </Message>
            );
          }
        })}
    </MessageContainer>
      <InputContainer>
        <ChatInput
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            
          }}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </InputContainer>
      {
        (showPopUp)
        &&
  
        <PopupContainer>
          {console.log("popup container")}
          <PopupContent>
          {console.log("PopupContent")}

            <CloseButton onClick={() => setShowPopUp(!showPopUp)}>X</CloseButton>
          {console.log("close button down")}

            <Title>Rate Your Experience</Title>
            <StarsContainer>
              {[1, 2, 3, 4, 5].map((value) => (
                <StarIcon
                  key={value}
                  selected={value <= rating}
                  onClick={() => handleRatingChange(value)}
                >
                  ★
                </StarIcon>
              ))}
            </StarsContainer>
          {console.log("StarsContainer")}

            <SubmitButton onClick={(e)=>rateHandleFormSubmit(e)}>Finish</SubmitButton>
          </PopupContent>
        </PopupContainer>
      }
    </ChatContainer>
    )
  );
}

export default ChatUser;

const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 1;
}
`;

// const Message = styled.div`
//   background-color: ${props => (props.fromother === "true" ? "black" : "lightblue")};
//   color: ${props => (props.fromother === "true" ? "white" : "black")};
//   padding: 8px;
//   margin-bottom: 8px;
// `;

const CloseButton = styled.button`
position: absolute;
top: 10px;
right: 10px;
background: none;
border: none;
font-size: 20px;
cursor: pointer;
color: #333;
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
`;

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const UserProfilePhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserProfileName = styled.h2`
  margin: 0;
`;

const ChatHeader = styled.h1`
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  margin-top: 10px;
  color: #1a73e8;
  text-decoration: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
`;

const VideoCallButton = styled(ActionButton)`
  background-color: #1a73e8;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;

const FinishButton = styled.button`
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

const ReportButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const MessageDate = styled.p`
  text-align: center;
  margin: 10px;
  color: gray;
`;

// const Message = styled.div`
//   background-color: ${props => (props.fromother === "true" ? "black" : "lightblue")};
//   color: ${props => (props.fromother === "true" ? "white" : "black")};
//   padding: 8px;
//   margin-bottom: 8px;
// `;
const Message = styled.div`
  background-color: ${(props) => (props.fromother==="true" ? "#f0f0f0" : "#808080")};
  color: ${(props) => (props.fromother==="true" ? "black" : "white")};
  padding: 8px;
  margin: 8px 0;
  border-radius: ${(props) =>
    props.fromother ? "5px 5px 5px 0" : "5px 5px 0 5px"};
`;

const Timestamp = styled.p`
  color: black;
  font-size: 12px;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #1a73e8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #1565c0;
    transform: scale(1.05);
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

`;


const PopupContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StarIcon = styled.span`
  font-size: 30px;
  color: ${(props) => (props.selected ? "gold" : "gray")};
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
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