import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import styled from 'styled-components';


function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(() => {
    setLoading(true);
    const apiUrl = "http://localhost:5000/api";
    // Fetch leaderboard data from your server using Axios
    axios.get(`${apiUrl}/leaderboard`)
      .then(response => {
        setLeaderboardData(response.data);
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);
 

  const goBack = () => {
    window.history.back();
  };

  return (
    loading ?
    <div>
      <CustomLoader>
  <LoaderSpinner />
</CustomLoader>
    </div>
    :
    (
        <LeaderboardContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <LeaderboardTable>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Rating</TableHeader>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell><Link to={`/user/${user._id}`}>{user.name}</Link></TableCell>
              <TableCell>{user.rating.ratingValue}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </LeaderboardTable>
      <BackButton onClick={goBack}>Back</BackButton>
    </LeaderboardContainer>)
  );
}

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

const LeaderboardContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f9fa;
`;

const LeaderboardTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;

const TableHeader = styled.th`
  padding: 10px 15px;
  background-color: #f2f2f2;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
`;

const BackButton = styled.button`
  padding: 10px 20px;
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

export default Leaderboard;
