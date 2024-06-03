import React from 'react';
import { NavLink } from 'react-router-dom';
import './tusastyles.css'

function NavBar() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/home">Home</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Plan & Schedule</NavLink>
          <div className="dropdown-content">
            <NavLink to="/autoscheduler">Automatic Scheduler</NavLink>
            <NavLink to="/declare">Major/Minor Declaration</NavLink>
            <NavLink to="/progress">My Progress</NavLink>
          </div>
        </li>
        <li><NavLink to="/catalog">Catalog</NavLink></li>
        <li><NavLink to="/calendar">Calendar</NavLink></li>
        <li className="dropdown">
          <NavLink to="#" className="dropbtn">Account</NavLink>
          <div className="dropdown-content">
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/preferences">Preferences</NavLink>
            <NavLink to="/previouscourses">Add Previous Courses</NavLink>
          </div>
        </li>
        <li><NavLink to="/notes">Notes</NavLink></li>
      </ul>
    </nav>
  );
}

export default NavBar;
