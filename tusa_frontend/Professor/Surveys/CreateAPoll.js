import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css'; 
import './surveystyles.css'; 
import NavBar from '../NavBar';
import Header from '../Header';

function CreatePoll() {
  const [formData, setFormData] = useState({
    username: '',
    title: '',
    description: '',
    question: '',
    options: [''],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const { jwt, username } = cookies;

    if (jwt && username) {
      setToken(jwt);
      setUsername(username); 
      setFormData(prevFormData => ({
        ...prevFormData,
        username: username 
      }));
    }
  }, []);

  const handleCreatePoll = async () => {
    console.log(formData);
    try {
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/addPoll.cgi`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response.data);
      alert('Poll successfully created!');
      setFormData({
        username: '',
        title: '',
        description: '',
        question: '',
        options: [''],
      });
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrorMessage('Failed to create poll. Please try again later.');
    }
  };  

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title"> 
            <p className="title-text"> CREATE POLL </p> 
          </section>
          <div className="poll-creation">
            <label htmlFor="title">Title:</label><br />
            <input type="text" id="title" name="title" className="poll-creation-text" value={formData.title} onChange={handleChange} /><br /><br />
            <label htmlFor="description">Description:</label><br />
            <input type="description" name="description" className="poll-creation-text" value={formData.description} onChange={handleChange} /><br /><br />
            <label htmlFor="question">Question:</label><br />
            <input type="text" id="question" name="question" className="poll-creation-text" value={formData.question} onChange={handleChange} /><br /><br />
            {formData.options.map((option, index) => (
              <div key={index}>
                <label htmlFor={`option-${index}`}>Option {index + 1}:</label><br />
                <input type="text" id={`option-${index}`} name={`option-${index}`} className="poll-creation-text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} /><br /><br />
              </div>
            ))}
            <button onClick={handleAddOption}>Add Option</button><br /><br />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleCreatePoll}>Create Poll</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreatePoll;
