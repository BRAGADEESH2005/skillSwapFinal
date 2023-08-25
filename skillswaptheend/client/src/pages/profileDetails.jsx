  import React, { useState ,useEffect} from 'react';
  import styled from 'styled-components';
  import axios from 'axios';
  import Navbar from '../components/navbar';
  import { useNavigate } from 'react-router-dom';






  const ProfileForm = () => {
    const [gender, setGender] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState(["English"]);
    const [user,setUser]=useState({});
    const [skillsKnown, setSkillsKnown] = useState([]);
    const [skillsRequired, setSkillsRequired] = useState([]);
    const [image, setImage] = useState(null);
    const [amount, setAmount] = useState(0);
    const [days, setDays] = useState(0);
    const [loading,setLoading]=useState(true);
    const navigate = useNavigate();
    const categories = [
      'Programming & Technology',
      'Hobbies & Crafts',
      'Academics & Education',
      'Languages & Linguistics',
      'Business & Entrepreneurship',
      'Fitness & Wellness',
      'Music & Performing Arts',
      'Technology & Gadgets',
      'Personal Development',
      'Other',
    ];
    const apiUrl = "http://localhost:5000/api";

    const allLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'te', name: 'Telugu' },
      { code: 'ta', name: 'Tamil' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ur', name: 'Urdu' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'or', name: 'Odia' },
      { code: 'as', name: 'Assamese' },
      { code: 'ka', name: 'Kannada' },
      { code: 'ne', name: 'Nepali' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'zh', name: 'Chinese' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ru', name: 'Russian' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'it', name: 'Italian' },
      { code: 'nl', name: 'Dutch' },
      { code: 'tr', name: 'Turkish' },
    ];
    
    const handleAddLanguage = () => {
      setSelectedLanguages((prevLanguages) => [...prevLanguages, "English"]);
    };

    const handleLanguageChange = (e, index) => {
      const updatedLanguages = [...selectedLanguages];
      updatedLanguages[index] = e.target.value;
      setSelectedLanguages(updatedLanguages);
    };

    const handleSkillChange = (e, index, field) => {
      const updatedSkills = [...field];
      updatedSkills[index] = { ...updatedSkills[index], [e.target.name]: e.target.value };
      field === skillsKnown ? setSkillsKnown(updatedSkills) : setSkillsRequired(updatedSkills);
    };

    const handleCategoryChange = (e, index, field) => {
      const updatedSkills = [...field];
      updatedSkills[index] = { ...updatedSkills[index], category: e.target.value };
      field === skillsKnown ? setSkillsKnown(updatedSkills) : setSkillsRequired(updatedSkills);
    };

    function converttobase64(file){
      return new Promise((resolve,reject)=>{
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
          resolve(fileReader.result)
        };
        fileReader.onerror=(error)=>{
          reject(error)
        }
      }
      )}
    
      const handleSubmit = async (e) => {
        e.preventDefault();

      
        try {
          // Retrieve the JWT token from localStorage
          const token = localStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not present
            console.error('JWT token not found in localStorage');
            navigate("/register");
            return;
          }
          {console.log("Skillsss reqqq--",skillsRequired,"amountt--",amount,"gender ---",gender)}
          if (skillsRequired.length === 0){
            alert("Skills Required must be given")
          }else if(gender === ""){
            alert("Please Select your gender")
          } else if (amount <= 0){
            alert("Enter the amount greater than 0")
          }else{
          // Make a request to the backend with the JWT token in the Authorization header
          const user_id = user._id;
          await axios.post(`${apiUrl}/profileDetails`, {
            headers: { Authorization: `Bearer ${token}` },
            user_id,
            gender,
            selectedLanguages,
            skillsKnown,
            skillsRequired,
            image,
            amount,
            days
          });
      
          console.log("pd res");
          navigate("/dashboard");}
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };
      
      

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
      
            const response = await axios.get(`${apiUrl}/dashboard`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log("res ",response)
            console.log("res ",response.data.user.image)
      
            setUser(response.data.user);
            setGender(response.data.user.gender || ''); // Default to empty string if undefined
            setImage(response.data.user.image || null);
            setAmount((response.data.user.amount!==0) ? response.data.user.amount :0);
            setDays((response.data.user.days!==0) ? response.data.user.days :0);
      
            // Set selected languages from the API response, or default to ['en'] if undefined
            setSelectedLanguages(response.data.user.selectedLanguages || ['en']);
      
            // Set skillsKnown and skillsRequired from the API response, or default to empty arrays if undefined
            setSkillsKnown(response.data.user.skillsKnown || []);
            setSkillsRequired(response.data.user.skillsRequired || []);
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        };
      
        fetchUserDetails();
      }, [navigate]);
      
      const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const imageData = await converttobase64(file);
          setImage(imageData);
        }
      };
      

    return (
      loading ?
      <div>
        <CustomLoader>
    <LoaderSpinner />
  </CustomLoader>
      </div>
      :(
      <div>
        <Navbar />
        <FormContainer>
          <FormTitle>Profile Details</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <h3>Gender:</h3>
              <FormInput
                type="radio"
                value="Male"
                checked={gender === "Male"}
                onChange={() => setGender("Male")}
              />{' '}
              Male
              <FormInput
                type="radio"
                value="Female"
                checked={gender === "Female"}
                required
                onChange={() => setGender("Female")}
              />{' '}
              Female
            </FormGroup>

            {/* Languages Known */}
            <h3>Languages Known:</h3>

            {selectedLanguages.map((language, index) => (
              <FormGroup key={index}>
                <FormLabel>Language {index + 1}:</FormLabel>
                <FormSelect required value={language} onChange={(e) => handleLanguageChange(e, index)}>
                  <option value="" disabled>Select Language</option>
                    {allLanguages.map((lang) => (
                      <option key={lang.code} value={lang.name}>
                        {lang.name}
                  </option>
                    ))}
                </FormSelect>

              </FormGroup>
            ))}

            <FormButton type="button" onClick={handleAddLanguage}>
              Add Language
            </FormButton>
            <br />

        
            <FormGroup>
              <h3>Skills Known:</h3>
              {skillsKnown.map((skill, index) => (
        <div key={index}>
      <h3>Skill {index + 1}:</h3>

          <FormSelect
            required
            value={skill.category}
            onChange={(e) => handleCategoryChange(e, index, skillsKnown)}
          >
            
          <option value="" disabled>Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          </FormSelect>
        <FormInput
          type="text"
          name="skill"
          value={skill.skill || ""}
          onChange={(e) => handleSkillChange(e, index, skillsKnown)}
          placeholder="Enter Skill"
        />
        </div>
        ))}
        <FormButton type='button' onClick={() => setSkillsKnown([...skillsKnown, { category: "", skill: "" }])}>
          Add Skill
        </FormButton>

            </FormGroup>

            {/* Skills Required */}
            <FormGroup>
              <h3>Skills Required:</h3>
              {skillsRequired.map((skill, index) => (
    <FormGroup key={index}>
      <h3>Skill {index + 1}:</h3>
      <FormSelect
        required
          value={skill.category}
          onChange={(e) => handleCategoryChange(e, index, skillsRequired)}
        >
          <option value="" disabled>Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
      </FormSelect>
        <FormInput
          type="text"
          name="skill"
          value={skill.skill || ""}
          onChange={(e) => handleSkillChange(e, index, skillsRequired)}
          placeholder="Enter Skill"
          required
        />
      </FormGroup>
    ))}
      <FormButton type="button" onClick={() => setSkillsRequired([...skillsRequired, { category: "", skill: "" }])}>
        Add Skill
      </FormButton>
      </FormGroup>

 {/* money and time */}
 <label htmlFor="amount"><h3>Skill Coins per course</h3></label>
 <input type="number" id='amount' value={amount} onChange={(e) => {setAmount(parseInt(e.target.value,10));console.log(typeof (parseInt(e.target.value)));console.log(parseInt(e.target.value))}} />
 {/* <label htmlFor="days">Days</label>
 <input type="number" id='days' value={days} onChange={(e) => setDays(parseInt(e.target.value,10))} /> */}
 {/* Image Upload */}
 <FormGroup>
      <h3>Upload Image:</h3>
      {image && <img src={image}  style={{ height: '200px', width: '300px' }}alt="Uploaded" />}
      <FormInput
        type="file"
        onChange={handleImageUpload}
        {...(image === null&& { required: true })}
      />
    </FormGroup>






            {/* Submit Button */}
            <SubmitButton type="submit">Submit</SubmitButton>
          </form>
        </FormContainer>
      </div>)
    );
  };

  const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to right, #f4f4f4, #ffffff);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  font-weight: bold;
  color: #555;
  margin: 5px;
  font-size: 18px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 15px;
  color: #333;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;

  &:focus {
    background-color: #e0e0e0;
    outline: none;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 15px;
  color: #333;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
  margin-bottom:1

  &:focus {
    background-color: #e0e0e0;
    outline: none;
  }
`;

const CustomSelectArrow = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
`;

const FormButton = styled.button`
  background-color: #4169e1;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: rgba(65, 105, 225,0.4);
    transform: translateY(-2px);
  }
`;
const SubmitButton = styled.button`
  background-color: rgb(255,255,255);
  color: #4169e1;
  padding: 12px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  border-style:solid;

  &:hover {
    background-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
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


  export default ProfileForm;



  // </FormGroup>

  // {/* money and time */}
  // <label htmlFor="amount">Amount</label>
  // <input type="number" id='amount' value={amount} onChange={(e) => {setAmount(parseInt(e.target.value,10));console.log(typeof (parseInt(e.target.value)));console.log(parseInt(e.target.value))}} />
  // <label htmlFor="days">Days</label>
  // <input type="number" id='days' value={days} onChange={(e) => setDays(parseInt(e.target.value,10))} />
  // {/* Image Upload */}
  // <FormGroup>