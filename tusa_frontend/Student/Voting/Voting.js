import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './votingstyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function StudentPolls() {
  const [username, setUsername] = useState('');
  const [polls, setPolls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [suggestion, setSuggestion] = useState('');

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
      fetchPolls(username); 
    }
  }, []);

  const fetchPolls = async (username) => {
    try {
      const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showStudentPolls.cgi?username=${username}`);
      const filteredPolls = response.data.filter(poll => {
        const filteredQuestions = poll.questions.filter(question => {
          const hasUserResponse = question.responses.some(response => response.username === username);
          if (hasUserResponse) {
            console.log(`User '${username}' already responded to question '${question.question_id}' in poll '${poll.poll_id}'`);
          }
          return !hasUserResponse;
        });
        return filteredQuestions.length > 0;
      });
      console.log('Filtered Polls:', filteredPolls);
      setPolls(filteredPolls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setErrorMessage('Failed to fetch polls. Please try again later.');
    }
  };
  
  

  const handleVote = async (username, pollId, questionId, optionId) => {
    try {
      console.log('Voting:', { pollId, questionId, optionId });
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/votePoll.cgi',
        { username, pollId, questionId, optionId },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log(response);
      fetchPolls(username);
      alert('Vote submitted successfully!'); 
    } catch (error) {
      console.error('Error voting:', error);
      setErrorMessage('Failed to vote. Please try again later.');
    }
  };
  

  const handleSubmitSuggestion = async (event) => {
    event.preventDefault();
    
    try {
      console.log(selectedProgram);
      console.log('Submitting suggestion:', { program: selectedProgram, suggestion });
      await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/addSuggestion.cgi',
        {
          program: selectedProgram,
          suggestion
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      setSelectedProgram('');
      setSuggestion('');
      alert('Suggestion submitted successfully!');
    } catch (error) {
      setSelectedProgram('');
      setSuggestion('');
      alert('Suggestion submitted successfully!');
    }
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="title-text">POLLS AND SUGGESTIONS</p>
          </section>
        </main>
        <br />
        <div className="voting-section">
          <h5>Submit Suggestion:</h5>
          <form className="suggestion-card" onSubmit={handleSubmitSuggestion}>
            <label htmlFor="program">Program:</label> <br />
            <select id="program" value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}>
              <option value="">Select Program</option>
              <option value="BIO">Biology</option>
              <option value="CS">Computer Science</option>
              <option value="digitalArtsMedia">Digital Arts and Media</option>
              <option value="businessAdministration">Business Administration</option>
              <option value="french">French</option>
            </select>
            <br />
            <label htmlFor="suggestion">Suggestion:</label> <br />
            <textarea id="suggestion" value={suggestion} onChange={e => setSuggestion(e.target.value)} maxLength={50} />
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
        <br />
        <div className="polls-section">
        {polls.map((poll) => (
          <div key={poll.poll_id} className="suggestion-card">
            <h3>{poll.title}</h3>
            <p>{poll.description}</p>
            {poll.questions.map((question) => (
              <div key={question.question_id}>
                <p>{question.question_text}</p>
                <ul>
                  {question.options.map((option) => (
                    <li key={option.option_id}>
                      <div className="option-container">
                        <span>{option.option_text}</span>
                        <button onClick={() => handleVote(username, poll.poll_id, question.question_id, option.option_id)}>Vote</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default StudentPolls;







