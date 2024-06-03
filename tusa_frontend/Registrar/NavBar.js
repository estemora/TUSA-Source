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
          <li><NavLink to="/registrar-home" reloadDocument={shouldReload("/registrar-home")}>Home</NavLink></li>
	  <li className="dropdown">
              <NavLink to="#" className="dropbtn">Voting</NavLink>
              <div className="dropdown-content">
		  <NavLink to="/registrar-all-polls" reloadDocument={shouldReload("/registrar-all-polls")}>See Poll Results</NavLink>
		  <NavLink to="/registrar-all-suggestions" reloadDocument={shouldReload("/registrar-all-suggestions")}>See Suggestions</NavLink>
	      </div>
	  </li>
          <li className="dropdown">
          <NavLink to="#" className="dropbtn">Manage Catalog</NavLink>
          <div className="dropdown-content">
              <NavLink to="/registrar-upload-catalog" reloadDocument={shouldReload("/registrar-upload-catalog")}>Mass Delete/Upload Catalog</NavLink>
              <NavLink to="/registrar-delete-course" reloadDocument={shouldReload("/registrar-delete-courses")}>Delete Individual Courses</NavLink>
              <NavLink to="/registrar-add-course" reloadDocument={shouldReload("/registrar-add-course")}>Add Individual Courses</NavLink>
          </div>
         </li>
	  <li><NavLink to="/registrar-catalog" reloadDocument={shouldReload("/registrar-catalog")}>Catalog</NavLink></li>
          <li><NavLink to="/registrar-calendar" reloadDocument={shouldReload("/registrar-calendar")}>Calendar</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Notes</NavLink>
          <div className="dropdown-content">
            <NavLink to="/registrar-my-notes" reloadDocument={shouldReload("/registrar-my-notes")}>My Notes</NavLink>
              <NavLink to="/registrar-received-notes" reloadDocument={shouldReload("/registrar-received-notes")}>See Received Notes</NavLink>
	      <NavLink to="/registrar-all-notes" reloadDocument={shouldReload("/registrar-all-notes")}>See All Advising Notes</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
