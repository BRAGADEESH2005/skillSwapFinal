import React from "react";
import {BrowserRouter,Route, Routes} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Contact from "./pages/contact";
import About from "./pages/about";
import Home from "./pages/home";
import Logout from "./pages/logout";
import ProfileDetails from "./pages/profileDetails";
import UserProfile from "./pages/userProfile";  
import Notifications from "./pages/notifications";
import ChatUser from "./pages/chatUser";
import ChatUsers from "./pages/chatUsers";
import Leaderboard from "./pages/leaderboard";
import ResetPassword from "./pages/resetPassword";
import VideoChat from "./pages/videoChat";
import SkillCoins from "./pages/skillCoins";
import PaymentSuccess from "./pages/Payment_result/PaymentSuccess";
import PaymentFailure from "./pages/Payment_result/PaymentFailure";
import SkillCoinsRulePage from "./pages/skillCoinsRules";
export default function App(){
  //after register and profile details not navigating to dashboard instead stays in profile details
    return(
        <div>
         <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<Home />}/>
            <Route path="/p" exact element={<ProfileDetails />}/>
            <Route path="/about" exact Component={About} />
            <Route path="/contact" exact Component={Contact} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/login" exact Component={Login} />
            <Route path="/logout" exact Component={Logout} />
            <Route path="/register" exact Component={Register} />
            <Route path="/user/:userID" exact Component={UserProfile} /> 
            <Route path="/user/chat" exact Component={ChatUsers}/>
            <Route path="/user/chat/:chatUserID" exact Component={ChatUser}/>
            <Route path="/notifications" exact Component={Notifications}/>
            <Route path="/leaderboard" exact Component={Leaderboard}/>
            <Route path="/reset-password/:newtoken" exact Component={ResetPassword}/>
            <Route path="/user/video-chat/:email/:name" exact Component={VideoChat}></Route>
            <Route path="/skill-coins" exact element={<SkillCoins />} />
            <Route  path="/skill-coins/success" exact Component={PaymentSuccess}></Route>
            <Route  path="/skill-coins/failure" exact Component={PaymentFailure}></Route>
            <Route  path="/skill-coins/rules" exact Component={SkillCoinsRulePage}></Route>
        </Routes>
        </BrowserRouter>
        </div>
    )
}



  // //Code GPT
  // // src/App.js
  // import React, { useState } from 'react';
  // import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
  // import axios from 'axios';

  // const apiUrl = 'http://localhost:5000/api';

  // const App = () => {
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [token, setToken] = useState('');
    // const [protectedMessage, setProtectedMessage] = useState('');





  //   const handleProtectedRoute = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/protected`, { headers: { Authorization: token } });
  //       setProtectedMessage(response.data.message);
  //     } catch (error) {
  //       console.error('Error accessing protected route:', error);
  //       alert('Access to protected route failed');
  //     }
  //   };

  //   return (
  //     <Router>
  //       <div>
  //         <nav>
  //           <ul>
  //             <li>
  //               <Link to="/">Home</Link>
  //             </li>
  //             <li>
  //               <Link to="/login">Login</Link>
  //             </li>
  //             <li>
  //               <Link to="/register">Register</Link>
  //             </li>
  //             <li>
  //               <Link to="/protected">Protected Route</Link>
  //             </li>
  //           </ul>
  //         </nav>

  //         <Switch>
  //           <Route path="/login">
  //             <h2>Login</h2>
  //             <div>
  //               <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
  //               <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
  //               <button onClick={handleLogin}>Login</button>
  //             </div>
  //           </Route>
  //           <Route path="/register">
  //             <h2>Register</h2>
  //             <div>
  //               <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
  //               <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
  //               <button onClick={handleRegister}>Register</button>
  //             </div>
  //           </Route>
  //           <Route path="/protected">
  //             <h2>Protected Route</h2>
  //             <div>
  //               {token ? (
  //                 <>
  //                   <button onClick={handleProtectedRoute}>Access Protected Route</button>
  //                   <p>{protectedMessage}</p>
  //                 </>
  //               ) : (
  //                 <p>Please log in first to access the protected route.</p>
  //               )}
  //             </div>
  //           </Route>
  //           <Route path="/">
  //             <h2>Home</h2>
  //             <p>Welcome to the MERN stack JWT authentication example!</p>
  //           </Route>
  //         </Switch>
  //       </div>
  //     </Router>
  //   );
  // };

  // export default App;
