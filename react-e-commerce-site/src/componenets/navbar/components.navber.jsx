import React from 'react';
import { Link } from 'react-router-dom';
import './components.navbar.css';
import { auth } from '../../firebase/firebase';

const Navbar = ({ cartCount, setIsLoggedIn,skillCoins }) => {
  const logOut = () => {
    auth.signOut();
    localStorage.removeItem('email');
    localStorage.removeItem('uid');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('orderedItems');
    localStorage.removeItem('skillCoins');
    setIsLoggedIn(false);
  };
  return (
    <nav className="navbar">
      <h1 className="navbar__logo">
        <Link to="/" className='logoo'>E-commerce Site</Link>
      </h1>
      <div className="navbar__links">
        <Link to="/ordered" className="navbar__link">
          <h3 className="navbar__link-text">Ordered Items</h3>
        </Link>
        <Link to="/checkout" className="navbar__link">
          <h3 className="navbar__link-text">Cart ({cartCount})</h3>
        </Link>
        <p className="navbar__skill-coins">Skill coins : {skillCoins}</p>
        <button onClick={logOut} className="navbar__logout">
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
