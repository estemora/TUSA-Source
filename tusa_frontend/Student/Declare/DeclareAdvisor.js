import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './declarestyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function DeclareAdvisor() {
  const [formData, setFormData] = useState({
    advisor: [],
    username: ''
  });
  const [username, setUsername] = useState('');
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);
  const [suggestedOptions, setSuggestedOptions] = useState([]);
  const [advisorInput, setAdvisorInput] = useState('');
  const [declarations, setDeclarations] = useState([]);

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
      setFormData(prevFormData => ({
        ...prevFormData,
        username: username
      }));
      setUsername(user);
      fetchDeclarations(user);
    }
  }, []);

  const fetchDeclarations = async (user) => {
    try {
      const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showAdvisorDeclaration.cgi?username=${user}`);
      console.log('Response:', response.data); 
      
      if (Array.isArray(response.data)) {
        const advisorsData = response.data;
        
        const advisors = advisorsData.map(advisorData => advisorData.advisor);
        console.log('Advisors:', advisors); 
        
        setDeclarations(advisors);
      }
    } catch (error) {
      console.error('Error fetching courses taken:', error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    console.log('Input value:', value); 
    setAdvisorInput(value);
  
    if (value.trim() !== '') {
      axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showAdvisorOptions.cgi?query=${value}&username=${username}`)
        .then(response => {
          console.log('Response:', response); 
          setSuggestedOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestedOptions([]);
    }
  };  
  

  const handleSuggestedOptionClick = (advisor, e) => {
    e.preventDefault();
    if (!selectedAdvisors.includes(advisor)) {
      setSelectedAdvisors(prevAdvisors => [...prevAdvisors, advisor]);
      setFormData(prevFormData => ({
        ...prevFormData,
        advisor: [...prevFormData.advisor, advisor]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const advisors = selectedAdvisors.join(', ');
    
    console.log("FormData before submitting:", formData);
  
    axios.post(`http://www.cs.transy.edu/TUSA/js-login/front/build/declareAdvisor.cgi`, {
      username: username, 
      advisor: advisors,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        console.log(response.data);
        window.alert('Form submitted successfully!');
        fetchDeclarations(username);
        setAdvisorInput(''); 
        setSelectedAdvisors([]); 
        setSuggestedOptions([]);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        window.alert('Form submitted successfully!');
        setAdvisorInput(''); 
        setSelectedAdvisors([]); 
        setSuggestedOptions([]);
      });
  };

  const handleDelete = async (advisor) => {
    try {
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/deleteAdvisor.cgi',
        {
          username: username,
          advisor: advisor
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.status === 200) {
        alert(`"${advisor}" deleted successfully`);
        fetchDeclarations(username);
      } else {
        alert(`Failed to delete "${advisor}".`);
      }
    } catch (error) {
      console.error(`Error deleting "${advisor}":`, error);
      alert(`Error deleting "${advisor}". Please try again later.`);
    }
  };
  
  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="title-text"> DECLARE ADVISOR(S) </p>
          </section>
        </main>
        <br />
        <div className="declare-section">
        <form className="declare-form" onSubmit={handleSubmit}>
          <div className="declare-card">
              <h3> Declare Advisor: </h3> 
              <input
                type="text"
                id="advisor"
                name="advisor"
                value={advisorInput}
                className="declare-search"
                onChange={handleInputChange}
              />
              <br />
              {selectedAdvisors.map(advisor => (
                <div key={advisor}>
                  <p>{advisor}</p> 
                </div> 
              ))}
              <div className="selected-advisors-container">
          {Array.isArray(suggestedOptions) && suggestedOptions.map(option => (
            <div key={option.advisor}>
              <button
                className="advisor-item"
                onClick={(e) => handleSuggestedOptionClick(option.advisor, e)}
              >
                {option.advisor}
              </button>
              </div> 
          ))} </div>
            <br /></div>
          <br />
          <input className="declare-button" type="submit" value="Submit Declaration" />
        </form>
        </div>
        <div className="declared-section">
          <h2>Advisors:</h2>
          <ul>
          {declarations.map((advisor, index) => (
            <li key={index}>
              {advisor}
              <button className="delete-program" onClick={() => handleDelete(advisor)}>Delete</button>
            </li>
          ))}
          </ul>
        </div>
        <br />
      </div>
    </div>
  );
}

export default DeclareAdvisor;



