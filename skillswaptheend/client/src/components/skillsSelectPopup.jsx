import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';


const SkillSelectionPopup = ({ showpopup, onClose, preachSkills, learnSkills,setOpenPopup ,feedID,userID,payment}) => {
    
    const apiUrl = "http://localhost:5000/api";
    console.log("Iddd--",feedID);
    console.log("userID---",userID);

  const [selectedPreachSkill, setSelectedPreachSkill] = useState({});
  const [selectedLearnSkill, setSelectedLearnSkill] = useState({});

  const handlePreachSkillChange = (skill) => {
    setSelectedPreachSkill(skill);
  };

  const handleLearnSkillChange = (skill) => {
    setSelectedLearnSkill(skill);
  };

  const handleSubmit = () => {
    if (payment){
      PayRequest(feedID,userID,selectedLearnSkill);
    }else{
    swapRequest(feedID,userID,selectedPreachSkill, selectedLearnSkill);}
    onClose()
  };

  const PayRequest = async (feedID,userID,learnSkill) => {
    console.log("fid ", feedID," uid ",userID);
    try {
      if(learnSkill.skill === undefined){
        alert("select skills")
        return;
        
      }
      // Make a request to the backend with the JWT token in the Authorization header
      const response = await axios.post(`${apiUrl}/pay-request`, {feedID,userID,learnSkill});

      if(response.data.error === ""){
        console.log("swap request successfully sent from front end ")
      }else{
        console.log("error in sending swap request from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap request :', error);
    }}


  const swapRequest = async (feedID,userID,preachSkill,learnSkill) => {
    console.log("fid ", feedID," uid ",userID);
    console.log("pppp ", preachSkill.skill," lll ",learnSkill.skill);
    if(preachSkill.skill===undefined || learnSkill.skill === undefined){
      alert("select skills")
      return;
      
    }
    try {

      // Make a request to the backend with the JWT token in the Authorization header
      const response = await axios.post(`${apiUrl}/swap-request`, {feedID,userID,preachSkill,learnSkill});

      if(response.data.error === ""){
        console.log("swap request successfully sent from front end ")
      }else{
        console.log("error in sending swap request from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap request :', error);
    }}

  return (
    <PopupContainer showpopup={showpopup}>
      <PopupContent>
        <Section>
          <h2>Your Preach Skill:</h2>
          {console.log("preach",preachSkills)}
          {console.log("learn",learnSkills)}
          {!payment && preachSkills.map((skill,index) => (
            <CheckboxLabel key={index}>
              <input
                type="radio"
                checked={selectedPreachSkill === skill}
                onChange={() => handlePreachSkillChange(skill)}
              />
              {skill.skill}
              [ {skill.category} ]
            </CheckboxLabel>
          ))}
        </Section>
        <Section>
          <h2>Other User's Learn Skill:</h2>
          {learnSkills.map((skill,index) => (
            <CheckboxLabel key={index}>
              <input
                type="radio"
                checked={selectedLearnSkill === skill}
                onChange={() => handleLearnSkillChange(skill)}
              />
                {skill.skill}
              [ {skill.category} ]
            </CheckboxLabel>
          ))}
        </Section>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </PopupContent>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ showpopup }) => (showpopup ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export default SkillSelectionPopup;
