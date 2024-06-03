import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './tusastyles.css';
import { useAuth } from './AuthProvider'; 

function Header() {
  const { logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    logout(); 
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header>
      <div className="account" onClick={toggleDropdown}>
        <img src="./Profile.png" alt="Profile" />
        {dropdownVisible && (
          <div className="dropdown-content">
            <Link to="/student-profile">Go To Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <div className="notifications">
        <Link to="/student-notifications">
          <img src="./Notifs.png" alt="Notifications" />
        </Link>
      </div>
      <div className="help">
        <Link to="#">
          <img src="./Tutorial.png" alt="Help" />
        </Link>
      </div>
      <h1>T.U.S.A.</h1>
      <h2>Transylvania University Scheduling Assistant</h2>
    </header>
  );
}

export default Header;



