import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './tusastyles.css';
import './loginstyles.css';

function Signup2() {
  const [additionalData, setAdditionalData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    preferred_name: '',
    gradmonth: 'May',
    gradyear: '2024',
    classStatus: 'Freshman' 
  });

  const location = useLocation();

  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state) {
      console.log('Setting additional data from location state:', location.state);
      setAdditionalData(prevData => ({
        ...prevData,
        username: location.state.username || '',
        password: location.state.password || '',
        email: location.state.email || ''
      }));
    } else {
      console.error('Form data not found in location state');
    }
  }, [location.state]);
  
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdditionalData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'classStatus') {
      // Adjust gradyear based on classStatus
      const maxGradYear = getMaxGradYear(value);
      setAdditionalData(prevData => ({
        ...prevData,
        gradyear: Math.min(prevData.gradyear, maxGradYear).toString() // Ensure the selected gradyear is valid
      }));
    }
  };
  
  const getMaxGradYear = (classStatus) => {
    // Define a map of classStatus to max graduation year
    const maxGradYears = {
      Freshman: 2028,
      Sophomore: 2027,
      Junior: 2026,
      Senior: 2025
    };
    return maxGradYears[classStatus] || 2028; // Default to 2028 for unknown classStatus
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      console.log('Inside handleSubmit function'); 
      console.log('Additional Data:', additionalData); 
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/createAccount3.cgi',
        new URLSearchParams(additionalData).toString(), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // making sure type is html
          }
        }
      ); 
      console.log('Response:', response.data);
      window.location.href = 'http://www.cs.transy.edu/TUSA/js-login/front/build';
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  return (
    <div>
      <h1>Create An Account</h1>
      <div className="login-container">
      <form action="http://www.cs.transy.edu/TUSA/js-login/front/build/createAccount3.cgi" className="login-form" method="POST" onSubmit={handleSubmit}>
          <div className="input-group" required>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="first name"
              value={additionalData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="input-group">
            <label htmlFor="middle_name">Middle Name: </label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              placeholder="middle name (if applicable)"
              value={additionalData.middle_name}
              onChange={handleInputChange}
            />
          </div>


          <div className="input-group" required>
            <label htmlFor="last_name">Last Name: </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="last name"
              value={additionalData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="preferred_name">Preferred Name: </label>
            <input
              type="text"
              id="preferred_name"
              name="preferred_name"
              placeholder="preferred name"
              value={additionalData.preferred_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="classStatus">Class Status:</label>
            <select
              id="classStatus"
              name="classStatus"
              value={additionalData.classStatus}
              onChange={handleInputChange}
              required
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="Anticipated Graduation Date">
            <label htmlFor="gradmonth">Planned Graduation Date: </label> <br /> <br />
            <select
              className="large-dropdown"
              id="gradmonth"
              name="gradmonth"
              value={additionalData.gradmonth}
              onChange={handleInputChange}
              required
            >
              <option value="may">May</option>
              <option value="december">December</option>
            </select>

            <select
              id="gradyear"
              name="gradyear"
              value={additionalData.gradyear}
              onChange={handleInputChange}
            >
              {[...Array(getMaxGradYear(additionalData.classStatus) - 2023 + 1).keys()].map(year => (
                <option key={year} value={String(2023 + year)}>{2023 + year}</option>
              ))}
            </select>
          </div>
          <br></br>
          <button type="submit" className="sign-in-button">
            Create an Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup2;

