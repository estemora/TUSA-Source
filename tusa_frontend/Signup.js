import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validation from './signupvalidation'
import './tusastyles.css';
import './loginstyles.css';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });


  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    console.log("Handling submit...");
    event.preventDefault();
    console.log ("Form Values", formData)
    const err = validation(formData);
    if (err.username === '' && err.email === '' && err.password === '' && err.confirm_password === '') {
      navigate('/signup2', { state: formData });
    }
  };

  return (
    <div>
      <h1>Create An Account</h1>
      <div className="login-container">
        <form
          action="#"
          method="POST"
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">E-mail: </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="yourtransy@transy.edu"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password: </label>
            <input
             title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="password"
              required
              onChange={handleInput}
            />
            <input type="checkbox" onClick={() => setShowPassword(!showPassword)} /> Show Password
          </div>
          <div className="input-group">
            <label htmlFor="confirm_password">Confirm Password: </label>
            <input
              type={showConfirmedPassword ? 'text' : 'password'}
              id="confirm_password"
              name="confirm_password"
              placeholder="confirm password"
              required
              onChange={handleInput}
            />
            <input type="checkbox" onClick={() => setShowConfirmedPassword(!showConfirmedPassword)} /> Show Password
          </div>
          <button type="submit" className="sign-in-button">
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;


