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
          <NavLink to="/student-home" reloadDocument={shouldReload("/student-home")}>
            Home
          </NavLink>
        </li>
        <li className="dropdown">
          <NavLink to="/student-autoscheduler" className="dropbtn" reloadDocument={shouldReload("/student-autoscheduler")}>
            Plan & Schedule
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/student-autoscheduler" reloadDocument={shouldReload("/student-autoscheduler")}>Automatic Scheduler</NavLink>
            <NavLink to="/student-declare-major" reloadDocument={shouldReload("/student-declare-major")}>Major Declaration</NavLink>
            <NavLink to="/student-declare-advisor" reloadDocument={shouldReload("/student-declare-advisor")}>Advisor Declaration</NavLink>
            <NavLink to="/student-progress" reloadDocument={shouldReload("/student-progress")}>My Progress</NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/student-catalog" reloadDocument={shouldReload("/student-catalog")}>
            Catalog
          </NavLink>
        </li>
        <li>
          <NavLink to="/student-calendar" reloadDocument={shouldReload("/student-calendar")}>
            Calendar
          </NavLink>
        </li>
        <li className="dropdown">
          <NavLink to="/student-profile" className="dropbtn" reloadDocument={shouldReload("/student-profile")}>
            Account
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/student-profile" reloadDocument={shouldReload("/student-profile")}>Profile</NavLink>
            <NavLink to="/student-preferences" reloadDocument={shouldReload("/student-preferences")}>Preferences</NavLink>
            <NavLink to="/student-previouscourses" reloadDocument={shouldReload("/student-previouscourses")}>Add Previous Courses</NavLink>
          </div>
        </li>
        <li className="dropdown">
          <NavLink to="/student-notes" className="dropbtn" reloadDocument={shouldReload("/student-notes")}>
            Notes
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/student-notes" reloadDocument={shouldReload("/student-notes")}>My Notes</NavLink>
            <NavLink to="/student-received-notes" reloadDocument={shouldReload("/student-received-notes")}>See Received Notes</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;


