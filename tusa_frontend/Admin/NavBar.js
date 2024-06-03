import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './tusastyles.css'

function NavBar() {

    const location = useLocation();

    const shouldReload = (to) => {
	return location.pathname === to;
    };
    
  return (
    <nav>
      <ul>
          <li><NavLink to="/admin-home" reloadDocument={shouldReload("/admin-home")}>Home</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Manage Accounts</NavLink>
          <div className="dropdown-content">
            <NavLink to="/admin-delete-account" reloadDocument={shouldReload("/admin-delete-account")}>Delete an Account</NavLink>
            <NavLink to="/admin-create-account" reloadDocument={shouldReload("/admin-create-account")}>Create Accounts</NavLink>
          </div>
        </li>
         <li className="dropdown">
          <NavLink to="#" className="dropbtn">Manage Catalog</NavLink>
          <div className="dropdown-content">
              <NavLink to="/admin-upload-catalog" reloadDocument={shouldReload("/admin-upload-catalog")}>Delete/Upload Catalog</NavLink>
              <NavLink to="/admin-delete-courses" reloadDocument={shouldReload("/admin-delete-courses")}>Delete Individual Courses</NavLink>
          </div>
         </li>
	  <li><NavLink to="/admin-catalog" reloadDocument={shouldReload("/admin-catalog")}>Catalog</NavLink></li>
          <li><NavLink to="/admin-calendar" reloadDocument={shouldReload("/admin-calendar")}>Calendar</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Notes</NavLink>
          <div className="dropdown-content">
            <NavLink to="/admin-my-notes" reloadDocument={shouldReload("/admin-my-notes")}>My Notes</NavLink>
            <NavLink to="/admin-received-notes" reloadDocument={shouldReload("/admin-recived-notes")}>See Received Notes</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
