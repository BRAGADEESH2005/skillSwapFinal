import React,{useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import Navbar from '../components/navbar';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('jwt');
        navigate('/');
      }, [navigate]);
    return (

        <div>
        <Navbar />
            <h1>Logged Out Successfully</h1>
        </div>
    )
}



export default Logout