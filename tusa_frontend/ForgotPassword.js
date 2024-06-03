import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validation from './signupvalidation';
import './loginstyles.css'; 
import './tusastyles.css'; 

function ForgotPassword() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');
    console.log('Form values:', values);

    const err = validation(values);
    console.log('Validation errors:', err);
  
    if (err.password === '' && err.email === '') {
      console.log('Validation successful, attempting password update...');
  
      const formData = new URLSearchParams();
      formData.append('password', values.password);
      formData.append('email', values.email);
  
      console.log('Sending request data:', formData);
  
      try {
        const res = await axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/updatePassword.cgi', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log('Password change successful. Response:', res.data);
        alert('Password changed successfully!');
        navigate('/');
      } catch (error) {
        console.error('An error occurred during password update:', error);
        if (error.response) {
          console.error('Server response data:', error.response.data);
          console.error('Server response status:', error.response.status);
          console.error('Server response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      }
    }
  };  
  

  return (
    <div>
      <img
        src="http://www.cs.transy.edu/TUSA/TUSAbettericon.jpeg"
        alt="TUSA Icon"
        className="center"
        width="300"
        height="150"
      />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">New Password:</label>
            <input
              title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
              type="password"
              placeholder="Enter New Password"
              name="password"
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
              type="password"
              placeholder="Confirm New Password"
              name="confirm_password"
              onChange={handleInput}
            />
            <span className="password-toggle-icon">
              <span className="password-toggle-icon">
                <i className="fas fa-eye"></i>
              </span>
            </span>
          </div>
          <button type="submit" className="sign-in-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;






