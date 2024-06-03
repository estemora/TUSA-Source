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
          <li><NavLink to="/professor-home" reloadDocument={shouldReload("/professor-home")}>Home</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Courses</NavLink>
          <div className="dropdown-content">
            <NavLink to="/professor-catalog" reloadDocument={shouldReload("/professor-catalog")}>Catalog</NavLink>
            <NavLink to="/professor-my-courses" reloadDocument={shouldReload("/professor-my-courses")}>My Courses</NavLink>
            <NavLink to="/professor-add-courses" reloadDocument={shouldReload("/professor-add-courses")}>Add Catalog Courses</NavLink>
          </div>
        </li>
         <li className="dropdown">
          <NavLink to="#" className="dropbtn">Surveys</NavLink>
          <div className="dropdown-content">
              <NavLink to="/professor-create-poll" reloadDocument={shouldReload("/professor-create-poll")}>Create Poll</NavLink>
              <NavLink to="/professor-manage-polls" reloadDocument={shouldReload("/professor-manage-polls")}>Manage Polls</NavLink>
              <NavLink to="/professor-student-suggestions" reloadDocument={shouldReload("/professor-student-suggestions")}>Student Suggestions</NavLink>
          </div>
        </li>
          <li><NavLink to="/professor-calendar" reloadDocument={shouldReload("/professor-calendar")}>Calendar</NavLink></li>
	  <li><NavLink to="/professor-profile" reloadDocument={shouldReload("/professor-profile")}>Profile</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Notes</NavLink>
          <div className="dropdown-content">
            <NavLink to="/professor-my-notes" reloadDocument={shouldReload("/professor-my-notes")}>My Notes</NavLink>
            <NavLink to="/professor-recived-notes" reloadDocument={shouldReload("/professor-recived-notes")}>See Received Notes</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
