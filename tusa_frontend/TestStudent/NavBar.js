import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './tusastyles.css';

function NavBar() {
  const location = useLocation();

  const shouldReload = (to) => {
    return location.pathname === to;
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/test-student-home" reloadDocument={shouldReload("/test-student-home")}>
            Home
          </NavLink>
        </li>
        <li className="dropdown">
          <NavLink to="/test-student-autoscheduler" className="dropbtn" reloadDocument={shouldReload("/test-student-autoscheduler")}>
            Plan & Schedule
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/test-student-autoscheduler" reloadDocument={shouldReload("/test-student-autoscheduler")}>Automatic Scheduler</NavLink>
            <NavLink to="/test-student-declare-major" reloadDocument={shouldReload("/test-student-declare-major")}>Major Declaration</NavLink>
            <NavLink to="/test-student-progress" reloadDocument={shouldReload("/test-student-progress")}>My Progress</NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/test-student-catalog" reloadDocument={shouldReload("/test-student-catalog")}>
            Catalog
          </NavLink>
        </li>
        <li>
          <NavLink to="/test-student-calendar" reloadDocument={shouldReload("/test-student-calendar")}>
            Calendar
          </NavLink>
        </li>
        <li className="dropdown">
          <NavLink to="/test-student-profile" className="dropbtn" reloadDocument={shouldReload("/test-student-profile")}>
            Account
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/test-student-profile" reloadDocument={shouldReload("/test-student-profile")}>Profile</NavLink>
            <NavLink to="/test-student-preferences" reloadDocument={shouldReload("/test-student-preferences")}>Preferences</NavLink>
            <NavLink to="/test-student-previouscourses" reloadDocument={shouldReload("/test-student-previouscourses")}>Add Previous Courses</NavLink>
          </div>
        </li>
        <li className="dropdown">
          <NavLink to="/test-student-my-notes" className="dropbtn" reloadDocument={shouldReload("/test-student-my-notes")}>
            Notes
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/test-student-my-notes" reloadDocument={shouldReload("/test-student-notes")}>My Notes</NavLink>
            <NavLink to="/test-student-received-notes" reloadDocument={shouldReload("/test-student-received-notes")}>See Received Notes</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;


