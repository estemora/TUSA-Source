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
		<Link to="/advisor-profile">
		    <img src="./Profile.png" alt="Profile" />
		</Link>
	    </div>
	    <div class="switch-view">
		<Link to="/professor-home">
		    <p> Switch to Professor View </p>
		</Link>
	    </div>
	    <div class="switch-to-stud-view">
		<Link to="/test-student-home">
		    <p> Switch to Test Student View </p>
		</Link>
	    </div>
	    <button className="logout" onClick={handleLogout}>Logout</button> 
	    <div className="notifications">
		<Link to="/advisor-notifications">
		    <img src="./Notifs.png" alt="Notifications" />
		</Link>
	    </div>
	    <div className="help">
		<Link to="/advisor-faqs">
		    <img src="./Tutorial.png" alt="FAQs" />
		</Link>
	    </div>
	    <h1>T.U.S.A.</h1>
	    <h2>Transylvania University Scheduling Assistant</h2>
	    <div className="view-indicator">
		<div className="view-indicator-text"> Advisor View </div>
	    </div>
	</header>
    );
}

export default Header;


