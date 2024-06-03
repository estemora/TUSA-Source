import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css'; 
import './surveystyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function StudentSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
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
        fetchSuggestions(); 
      }
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showAllSuggestions.cgi`);
            console.log(response.data.suggestions)
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setErrorMessage('Failed to fetch suggestions. Please try again later.');
        }
    };

    return (
        <div>
            <Header />
            <div className="below-nav">
                <NavBar />
                <main>
                    <section className="title">
                        <p className="title-text"> STUDENT SUGGESTIONS </p>
                    </section>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="display-suggestions-section">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="sent-suggestion">
                                <div className="suggestion">
                                    <p className="suggestion-subject">
                                        <div className="prof-suggestion-title">{suggestion.program_name}</div>
                                    </p>
                                    <div className="prof-suggestion-body">{suggestion.suggested_course}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudentSuggestions;





