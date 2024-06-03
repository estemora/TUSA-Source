import React, { useState, useEffect } from 'react';
import '../tusastyles.css';
import './coursesstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import axios from 'axios';

function Preferences() {
  const [formData, setFormData] = useState({
    courseTitle: [],
    username: '' 
  });

  const [token, setToken] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseTitleInput, setCourseTitleInput] = useState('');
  const [suggestedOptions, setSuggestedOptions] = useState([]);
  const [username, setUsername] = useState('');

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
      setToken(jwt);
      console.log('Username:', username);
      setFormData(prevFormData => ({
        ...prevFormData,
        username: username
      }));
      setUsername(username);
    }
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourseTitleInput(value);

    if (value.trim() !== '') {
      axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showCoursePreferences.cgi?query=${value}`)
        .then(response => {
          setSuggestedOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestedOptions([]);
    }
  };

  const handleSuggestedOptionClick = (courseTitle, e) => {
    e.preventDefault();
    if (!selectedCourses.includes(courseTitle)) {
      setSelectedCourses(prevCourses => [...prevCourses, courseTitle]);
      setFormData(prevFormData => ({
        ...prevFormData,
        courseTitle: [...prevFormData.courseTitle, courseTitle]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseTitles = selectedCourses.join(', ');
    
    console.log("FormData before submitting:", formData);
  
    axios.post(`http://www.cs.transy.edu/TUSA/js-login/front/build/addProfCourses.cgi`, {
      username: formData.username, 
      courseTitle: courseTitles,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        console.log(response.data);
        window.alert('Form submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        window.alert('Form submitted successfully!');
      });
  };
  
  return (
    <div>
      <Header />
      <div className="below-prev-nav">
        <NavBar />
        <main>
          <section className="add-courses-title">
            <p className="add-courses-text"> ADD MY COURSES </p>
          </section>
        </main>
      </div>
      <section className="add-courses-section">
        <form onSubmit={handleSubmit}>
          <div className="checkbox-group">
            <div className="category">
              <label htmlFor="courseTitle"> Course Name: </label>
              <input
                type="text"
                id="courseTitle"
                name="courseTitle"
                value={courseTitleInput}
                onChange={handleInputChange}
              />

              {selectedCourses.map(course => (
                <div key={course}>
                  <p>{course}</p>
                </div>
              ))}

              {suggestedOptions.map(option => (
                <div key={option.courseId}>
                  <button
                    className="suggested-option"
                    onClick={(e) => handleSuggestedOptionClick(option.courseTitle, e)}
                  >
                    {option.courseTitle}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <br /><br />
          <input className="add-courses-button" type="submit" value="Submit" />
        </form>
      </section>
    </div>
  );
}

export default Preferences;
