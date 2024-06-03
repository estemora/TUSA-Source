import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './surveystyles.css'; // Import the survey styles
import NavBar from '../NavBar';
import Header from '../Header';

function MyPolls() {
  const [polls, setPolls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    let username = '';

    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'username') {
        username = value;
      }
    });

    setUsername(username);

    if (username) {
      fetchPolls();
    }
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://www.cs.transy.edu/TUSA/js-login/front/build/showAllPolls.cgi');
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setPolls(response.data);
      } else {
        setErrorMessage('Polls data is not in the correct format.');
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setErrorMessage('Failed to fetch polls. Please try again later.');
    }
  };


  const countResponses = (responses, optionId) => {
    return responses.filter(response => response.option_id === optionId).length;
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="title-text"> MANAGE POLLS </p>
          </section>
          <div className="prof-polls-section">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {Array.isArray(polls) && polls.map((poll) => (
              <div key={poll.poll_id} className="prof-suggestion-card">
                <div className="poll-item">
                  <h3>{poll.title}</h3>
                  <p>{poll.description}</p>
                  {Array.isArray(poll.questions) && poll.questions.map((question) => (
                    <div key={question.question_id}>
                      <h4>{question.question_text}</h4>
                      <ul>
                      {Array.isArray(question.options) && question.options.map((option, index) => {
                        console.log('Options:', question.options);
                        console.log('Responses:', question.responses);
                        console.log(option.id);
                        const responseCount = countResponses(question.responses, option.id);
                        return (
                          <li key={index}>
                            {option.text} ({responseCount})
                          </li>
                        );
                      })}
                      </ul>
                      {console.log('Question Responses:', question.responses)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPolls;




