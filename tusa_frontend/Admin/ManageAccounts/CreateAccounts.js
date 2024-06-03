import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import validation from './signupvalidation'
import axios from 'axios';
import '../tusastyles.css'; 
import './accountsstyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function CreateAccount() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [formData, setFormData] = useState({
	username: '',
	email: '',
	password: '',
	confirm_password: '',
    });

    const navigate = useNavigate();

     const location = useLocation();

    const shouldReload = (to) => {
	return location.pathname === to;
    };
    
    const handleInput = (event) => {
	const { name, value } = event.target;
	setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const err = validation(formData);
			const response = await axios.post(
				'http://www.cs.transy.edu/TUSA/js-login/front/build/createProfAccount.cgi',
				new URLSearchParams(formData).toString(), 
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
			); 
			console.log('Response:', response.data);
			alert('Account created successfully!');
			// Reset form fields
			setFormData({
				username: '',
				email: '',
				password: '',
				confirm_password: ''
			});
			// Navigate to the desired location after successful submission
			// navigate('/'); // Example: Navigate to the home page
		} catch (error) {
			console.error('Error:', error);
			// Handle error, maybe display an error message to the user
		}
	};
	

return (
    <div>
	<Header />
	<div className="below-nav">
	    <NavBar />
	    <main>
		<section class="title">
		    <p class="title-text"> CREATE ACCOUNTS </p>
		</section>

		<form
		    action="#"
		    method="POST"
		    className="create-account-form"
		    onSubmit={handleSubmit}
		>
		<div className="prof-input-group">
			<label htmlFor="username">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				placeholder="username"
				required
				value={formData.username} // Set value to formData.username
				onChange={handleInput}
			/>
		</div>
		<div className="prof-input-group">
			<label htmlFor="email">E-mail: </label>
			<input
				type="text"
				id="email"
				name="email"
				placeholder="yourtransy@transy.edu"
				required
				value={formData.email} // Set value to formData.email
				onChange={handleInput}
			/>
		</div>
		<div className="prof-input-group">
			<label htmlFor="password">Password: </label>
			<input
				title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
				type={showPassword ? 'text' : 'password'}
				id="password"
				name="password"
				placeholder="password"
				required
				value={formData.password} // Set value to formData.password
				onChange={handleInput}
			/>
			<br />
		</div>
		<div className="prof-input-group">
			<label htmlFor="confirm_password">Confirm Password: </label>
			<input
				type={showConfirmedPassword ? 'text' : 'password'}
				id="confirm_password"
				name="confirm_password"
				placeholder="confirm password"
				required
				value={formData.confirm_password} // Set value to formData.confirm_password
				onChange={handleInput}
			/>
		</div>
			<button type="submit"  className="sign-in-button">
			    Create Account
			</button>
		    </form>
		    <br /> <br />
		</main>
	    </div>
	</div>
    );
}

export default CreateAccount;
