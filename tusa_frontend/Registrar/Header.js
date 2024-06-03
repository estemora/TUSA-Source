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
      <button className="logout-admin" onClick={handleLogout}>Logout</button> 
      <div className="notifications">
        <Link to="/registrar-notifications">
          <img src="./Notifs.png" alt="Notifications" />
        </Link>
      </div>
      <div className="help">
        <Link to="/registrar-faqs">
          <img src="./Tutorial.png" alt="Help" />
        </Link>
      </div>
      <h1>T.U.S.A.</h1>
      <h2>Transylvania University Scheduling Assistant</h2>
    </header>
  );
}

export default Header;


