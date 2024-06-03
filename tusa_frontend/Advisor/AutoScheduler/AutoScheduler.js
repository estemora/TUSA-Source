import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './autoschedulestyles.css';
import Header from '../Header';
import NavBar from '../NavBar';

function AutoScheduler() {

  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [fetchedSchedule, setFetchedSchedule] = useState('');

  const handleGenerateSchedule = () => {
    setIsGenerating(true);
    console.log('Username:', username);

    axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/autoschedule.cgi', { username }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(() => {
        console.log('CGI script executed successfully');
        axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/displaySchedule.cgi', { username }, {
        })
          .then(response => {
            console.log('Schedule fetched successfully:', response.data);
            setFetchedSchedule(response.data);
            console.log('Schedule fetched successfully:', response.data);
            setIsGenerating(false);
          })
          .catch(error => {
            console.error('Error fetching schedule:', error);
            setIsGenerating(false);
          });
      })
      .catch(error => {
        console.error('Error running CGI script:', error);
        setIsGenerating(false);
      });
  };

  useEffect(() => {
    const cookieString = document.cookie;
    console.log('Cookies:', cookieString);

    const cookies = cookieString.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const { jwt, username } = cookies;

    if (jwt && username) {
      setUsername(username);
      console.log('Username:', username);
      fetchPreferences(username);
    }
  }, []);

  const fetchPreferences = async (username) => {
    try {
      const response = await axios.get(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/showPreferences.cgi?username=${username}`,
      );
      console.log('Response:', response.data);

      const { courses, instructional_styles, program_names, foreign_languages } = response.data;
      console.log('Courses:', courses);
      console.log('Instructional Styles:', instructional_styles);
      console.log('Program Names:', program_names);
      console.log('Foreign Languages:', foreign_languages);

      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleDelete = async (preference, type) => {
    try {
      console.log("Preference to delete:", preference);
      console.log("Type:", type);
      console.log("Username:", username);

      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/deletePreferences.cgi`,
        {
          username: username,
          preference: preference,
          type: type
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        alert(`"${preference}" deleted successfully`);
        fetchPreferences(username);
      } else {
        alert(`Failed to delete "${preference}".`);
      }
    } catch (error) {
      console.error('Error deleting preference:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="title-text">AUTO SCHEDULE</p>
          </section>
        </main>
        <br />
        <div id="autoScheduleSection" className="auto-schedule-section">
          <h2>Currently Set Preferences</h2>
          <div className="preferenced-section">
            {preferences.courses && (
              <div>
                <h3>Courses</h3>
                <ul>
                  {preferences.courses.map((course, index) => (
                    <li key={index}>
                      {course}
                      <button className="delete-preference" onClick={() => handleDelete(course, 'Courses')}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {preferences.instructional_styles && (
              <div>
                <h3>Instructional Styles</h3>
                <ul>
                  {preferences.instructional_styles.map((style, index) => (
                    <li key={index}>
                      {style}
                      <button className="delete-preference" onClick={() => handleDelete(style, 'InstructionalStyles')}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {preferences.program_names && (
              <div>
                <h3>Program Names</h3>
                <ul>
                  {preferences.program_names.map((program, index) => (
                    <li key={index}>
                      {program}
                      <button className="delete-preference" onClick={() => handleDelete(program, 'ProgramNames')}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {preferences.foreign_languages && (
              <div>
                <h3>Foreign Languages</h3>
                <ul>
                  {preferences.foreign_languages.map((language, index) => (
                    <li key={index}>
                      {language}
                      <button className="delete-preference" onClick={() => handleDelete(language, 'ForeignLanguages')}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <br />
        </div>
        {!isGenerating && fetchedSchedule && (
          <div>
            <h2>Fetched Schedule</h2>
            <div>{fetchedSchedule}</div>
          </div>
        )}
        {isGenerating ? (
          <div className="auto-schedule-card">Generating your schedule...</div>
        ) : (
          <button id="generateScheduleButton" className="declare-button" onClick={handleGenerateSchedule}>
            Generate Schedule
          </button>
        )}
        {isGenerating && <br />}
      </div>
    </div>
  );
}

export default AutoScheduler;




