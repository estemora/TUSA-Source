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
		<Link to="/professor-profile">
		    <img src="./Profile.png" alt="Profile" />
		</Link>
	    </div>
	    <div class="switch-view">
		<Link to="/advisor-home">
		    <p> Switch to Advisor View </p>
		</Link>
	    </div>
	    <button className="logout" onClick={handleLogout}>Logout</button> 
	    <div className="notifications">
		<Link to="/professor-notifications">
		    <img src="./Notifs.png" alt="Notifications" />
		</Link>
	    </div>
	    <div className="help">
		<Link to="/professor-faqs">
		    <img src="./Tutorial.png" alt="FAQs" />
		</Link>
	    </div>
	    <h1>T.U.S.A.</h1>
	    <h2>Transylvania University Scheduling Assistant</h2>
	    <div className="view-indicator">
		<div className="view-indicator-text"> Professor View </div>
	    </div>
	</header>
    );
}

export default Header;


