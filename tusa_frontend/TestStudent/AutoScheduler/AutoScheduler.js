import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../tusastyles.css';
import './autoschedulestyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import { toast } from 'react-toastify';

function AutoScheduler() {

  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [fetchedSchedule, setFetchedSchedule] = useState('');
  const [savedSchedule, setSavedSchedule] = useState('');
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);
  const [isSavedScheduleExpanded, setIsSavedScheduleExpanded] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(true); 

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
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then(response => {
            console.log('Schedule fetched successfully:', response.data);
            setFetchedSchedule(formatSchedule(response.data)); 
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

  const handleSaveSchedule = () => {
    console.log(fetchedSchedule)
    setSavedSchedule(formatSchedule(fetchedSchedule))
    axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/saveSchedule.cgi', { username }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(() => {
      console.log('Schedule saved successfully');
      setIsScheduleSaved(true);
      setIsSaveButtonDisabled(true); // Disable the button after successful save
      setIsSaveButtonVisible(false); // Hide the button after successful save
      alert('Schedule saved successfully');
    })
    .catch(error => {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    });
  };

  function formatSchedule(schedule) {
    const formattedSchedule = {};
  
    for (const key in schedule) {
      const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      formattedSchedule[capitalizedKey] = schedule[key].map(course => {
        return {
          course_name: course.course_name,
          course_title: course.course_title,
          course_representation: course.course_representation,
          credits: course.credits
        };
      });
    }
  
    return formattedSchedule;
  }
  
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
      fetchSavedSchedule(username);
    }
  }, []);

  const fetchPreferences = async (username) => {
    try {
      const response = await axios.get(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/showPreferences.cgi?username=${username}`,
      );
      console.log('Response:', response.data);

      const { courses, instructional_styles, program_names, foreign_languages, negative_courses, negative_program_names } = response.data;
      console.log('Wanted Courses:', courses);
      console.log('Unwanted Courses:', negative_courses);
      console.log('Instructional Styles:', instructional_styles);
      console.log('Wanted Program Names:', program_names);
      console.log('Foreign Languages:', foreign_languages);
      console.log('Unwanted Program Names:', negative_program_names);


      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchSavedSchedule = async (username) => {
    try {
      const response = await axios.get(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/displaySavedSchedule.cgi?username=${username}`,
      );
      console.log('Currently Saved Schedule:', response.data);
      setSavedSchedule(formatSchedule(response.data));
    } catch (error) {
      console.error('Error fetching saved schedule:', error);
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
        toast(`"${preference}" deleted successfully`);
        fetchPreferences(username);
      } else {
        toast(`Failed to delete "${preference}".`);
      }
    } catch (error) {
      console.error('Error deleting preference:', error);
    }
  };

  const toggleSavedSchedule = () => {
    setIsSavedScheduleExpanded(!isSavedScheduleExpanded);
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
        <Link to="/student-preferences" className="add-button">
            + Add Preferences
          </Link>
        <br/> <br/> <br />
        <div id="autoScheduleSection" className="auto-schedule-section">
          <h2>Currently Set Preferences</h2>
          <div className="preferenced-section">
            {preferences.courses && (
              <div>
                <h3>Wanted Courses</h3>
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
            {preferences.negative_courses && (
              <div>
                <h3>Unwanted Courses</h3>
                <ul>
                  {preferences.negative_courses.map((negative_course, index) => (
                    <li key={index}>
                      {negative_course}
                      <button className="delete-preference" onClick={() => handleDelete(negative_course, 'NegativeCourses')}>Delete</button>
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
                <h3>Wanted Program Names</h3>
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
            {preferences.negative_program_names && (
              <div>
                <h3>Unwanted Program Names</h3>
                <ul>
                  {preferences.negative_program_names.map((negative_program, index) => (
                    <li key={index}>
                      {negative_program}
                      <button className="delete-preference" onClick={() => handleDelete(negative_program, 'NegativeProgramNames')}>Delete</button>
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
        </div><br /><br />
        {savedSchedule && (
          <div className="auto-schedule-card">
            <br />
            <h2 onClick={toggleSavedSchedule} style={{ cursor: 'pointer' }}>
              {isSavedScheduleExpanded ? "Hide Currently Saved Schedule" : "Show Currently Saved Schedule"}
            </h2>
            {isSavedScheduleExpanded && (
              <div className="schedule-table">
                <table>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Course</th>
                      <th>Title</th>
                      <th>Representation</th>
                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(savedSchedule).map((season, index) => (
                      <>
                        {savedSchedule[season].map((course, courseIndex) => (
                          <tr key={`saved-course-${index}-${courseIndex}`}>
                            {courseIndex === 0 && <td rowSpan={savedSchedule[season].length}>{season}</td>}
                            <td className="table-column">{course.course_name}</td>
                            <td className="table-column">{course.course_title}</td>
                            <td className="table-column">{course.course_representation}</td>
                            <td className="table-column">{course.credits}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {!isGenerating && fetchedSchedule && (
          <div className="auto-schedule-card">
            <br />
            {isSaveButtonVisible && (
              <button id="saveScheduleButton" className={`saved-button ${isScheduleSaved ? 'saved' : ''}`} onClick={handleSaveSchedule} disabled={isSaveButtonDisabled}>
                {isScheduleSaved ? 'Schedule Saved' : 'Save New Schedule?'}
              </button>
            )}
            <h2>Generated Schedule</h2>
            <div className="schedule-table">
              <table>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Course</th>
                    <th>Title</th>
                    <th>Representation</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(fetchedSchedule).map((season, index) => (
                    <>
                      {fetchedSchedule[season].map((course, courseIndex) => (
                        <tr key={`course-${index}-${courseIndex}`}>
                          {courseIndex === 0 && <td rowSpan={fetchedSchedule[season].length}>{season}</td>}
                          <td className="table-column">{course.course_name}</td>
                          <td className="table-column">{course.course_title}</td>
                          <td className="table-column">{course.course_representation}</td>
                          <td className="table-column">{course.credits}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isGenerating ? (
          <div className="auto-schedule-card">Generating your schedule... <br />
          <div className="loader"></div></div>
        ) : (
          <button id="generateScheduleButton" className="saved-button" onClick={handleGenerateSchedule}>
            Generate Schedule
          </button>
        )}
        {isGenerating && <br />}
      </div>
    </div>
  );
}

export default AutoScheduler;