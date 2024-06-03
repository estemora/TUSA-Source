import React from 'react';
import { Link } from 'react-router-dom';
import './tusastyles.css';
import { useAuth } from '../AuthProvider'; 

function Header() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); 
  };

  return (
    <header>
      <div className="account">
        <Link to="/student-profile">
          <img src="./Profile.png" alt="Profile" />
        </Link>
      </div>
      <button className="logout" onClick={handleLogout}>Logout</button> 
      <div className="notifications">
        <Link to="/student-notifications">
          <img src="./Notifs.png" alt="Notifications" />
        </Link>
      </div>
      <div className="help">
        <Link to="/student-faqs">
          <img src="./Tutorial.png" alt="Help" />
        </Link>
      </div>
      <h1>T.U.S.A.</h1>
      <h2>Transylvania University Scheduling Assistant</h2>
    </header>
  );
}

export default Header;


