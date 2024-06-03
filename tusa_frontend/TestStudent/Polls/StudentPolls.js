import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Polling } from 'react-polling';
import '../tusastyles.css';
import './declarestyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function StudentPolls() {
  const [username, setUsername] = useState('');
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    let user = '';
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'username') {
        user = value;
      }
    });
    if (user) {
      setUsername(user);
    }
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await axios.get('http://www.cs.transy.edu/TUSA/js-login/front/build/student-voting');
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleInput = (event) => {
    // Handle input change here
  };

  const submitForm = async (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  useEffect(() => {
    // Fetch responses initially
    fetchResponses();
  }, []);

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="declare-title">
            <p className="declare-text"> Poll/Survey Component </p>
          </section>
        </main>
        <br />
        <div className="declare-section">
          <form className="declare-form" onSubmit={submitForm}>
            <div className="declare-card">
              <label htmlFor="majors">
                <h3> Do you like TUSA: </h3>
              </label>
              <select name="majors" id="majors" onChange={handleInput} value={major} className="declare-select">
                <option value="NULL"></option>
                <option value="yes">Yes!</option>
                <option value="no">No...</option>
                <option value="idk">Idk</option>
              </select>
            </div>
            <button type="submit" className="declare-button">Submit Answer</button>
          </form>
        </div>
        <div className="declared-section">
          <h2>Responses:</h2>
          <ul>
            {responses.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </div>
        <Polling url="http://www.cs.transy.edu/TUSA/js-login/front/build/student-voting" interval={2000} />
      </div>
    </div>
  );
}

export default StudentPolls;




