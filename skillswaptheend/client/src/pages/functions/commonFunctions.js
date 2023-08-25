import axios from 'axios';
const apiUrl = "http://localhost:5000/api";

export const swapRequest = async (feedID,userID,preachSkill) => {
    console.log("fid ", feedID," uid ",userID);
    try {

      // Make a request to the backend with the JWT token in the Authorization header
      const response = await axios.post(`${apiUrl}/swap-request`, {feedID,userID});

      if(response.error === ""){
        console.log("swap request successfully sent from front end ")
      }else{
        console.log("error in sending swap request from front end")
      }
      
    } catch (error) {
      console.error('Failed inin swap request :', error);
    }

  }



