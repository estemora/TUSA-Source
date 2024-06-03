import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './preferencesstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';

function Preferences() {
  const [formData, setFormData] = useState({
    username: '',
    courseTitle: [],
    negativeCourseTitle: [],
    InstructionalStyle: [],
    ForeignLanguage: '',
    programName: [],
    negativeProgramName: []
  });

  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [suggestedOptions, setSuggestedOptions] = useState([]);
  const [negativeSuggestedOptions, setNegativeSuggestedOptions] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [negativeSelectedCourses, setNegativeSelectedCourses] = useState([]);
  const [courseTitleInput, setCourseTitleInput] = useState('');
  const [negativeCourseTitleInput, setNegativeCourseTitleInput] = useState('');

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio' && name === 'ForeignLanguage') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    } else {
      // For checkboxes, handle as before
      const checked = e.target.checked;
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: checked
          ? [...prevFormData[name], value]
          : prevFormData[name].filter(item => item !== value)
      }));
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
  
  const handleNegativeSuggestedOptionClick = (negativeCourseTitle, e) => {
    e.preventDefault(); 
    if (!negativeSelectedCourses.includes(negativeCourseTitle)) {
      setNegativeSelectedCourses(prevNegativeCourses => [...prevNegativeCourses, negativeCourseTitle]);
      setFormData(prevFormData => ({
        ...prevFormData,
        negativeCourseTitle: [...prevFormData.negativeCourseTitle, negativeCourseTitle] 
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Concatenate course titles into a single string
    const courseTitles = selectedCourses.join(', ');
    console.log(courseTitles);
    const negativeCourseTitles = negativeSelectedCourses.join(', ');
    console.log(negativeCourseTitles);
    const instructionalStyle = Array.isArray(formData.InstructionalStyle) ? formData.InstructionalStyle.join(', ') : formData.InstructionalStyle;
    const programName = Array.isArray(formData.programName) ? formData.programName.join(', ') : formData.programName;
    const foreignLanguage = formData.ForeignLanguage;
    const negativeProgramName = Array.isArray(formData.negativeProgramName) ? formData.negativeProgramName.join(', ') : formData.negativeProgramName;
  
    axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/addPreferences.cgi', {
      username: username,
      InstructionalStyle: instructionalStyle,
      programName: programName,
      negativeProgramName: negativeProgramName,
      courseTitle: courseTitles,
      negativeCourseTitle: negativeCourseTitles,
      ForeignLanguage: foreignLanguage,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        console.log(response.data);
        window.alert('Preferences submitted successfully!');
        setCourseTitleInput('');
        setSelectedCourses([]);
        setNegativeSelectedCourses([]);
        setNegativeCourseTitleInput('');
        setFormData({
          ...formData,
          courseTitle: [],
          negativeCourseTitle: [],
          InstructionalStyle: [],
          ForeignLanguage: '',
          programName: [],
          negativeProgramName: []
        });
        setSuggestedOptions([]);
        setNegativeSuggestedOptions([]);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        window.alert('Preferences submitted successfully!');
        setCourseTitleInput('');
        setSelectedCourses([]);
        setNegativeSelectedCourses([]);
        setNegativeCourseTitleInput('');
        setFormData({
          ...formData,
          courseTitle: [],
          negativeCourseTitle: [],
          InstructionalStyle: [],
          ForeignLanguage: '',
          programName: [],
          negativeProgramName: []
        });
        setSuggestedOptions([]);
        setNegativeSuggestedOptions([]);
      });
  };  

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourseTitleInput(value); 
    
    if (value.trim() !== '') {
      axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showCoursePreferences.cgi?query=${value}&username=${formData.username}`)
        .then(response => {
          const filteredOptions = response.data.filter(option => !negativeSelectedCourses.includes(option.courseTitle));
          setSuggestedOptions(filteredOptions);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestedOptions([]);
    }
  };
  
  const handleNegativeInputChange = (e) => {
    const { value } = e.target;
    setNegativeCourseTitleInput(value); 
    
    if (value.trim() !== '') {
      axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showNegativeCoursePreferences.cgi?query=${value}&username=${formData.username}`)
        .then(response => {
          const filteredOptions = response.data.filter(option => !selectedCourses.includes(option.negativeCourseTitle));
          setNegativeSuggestedOptions(filteredOptions);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setNegativeSuggestedOptions([]); 
    }
  };  
  

  return (
    <div>
      <Header />
      <div className="below-preferences-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="title-text"> PREFERENCES </p>
          </section>
        </main>
      </div>
      <section className="preferences-section">
        <form onSubmit={handleSubmit}>
          <div className="checkbox-group">
            <div className="category">
              <label htmlFor="programName"> Wanted Program: </label>
              {programNames.map(program => (
                <label key={program}>
                  <input
                    type="checkbox"
                    name="programName"
                    value={program}
                    checked={formData.programName.includes(program)}
                    onChange={handleChange}
                  />
                  {program}
                </label>
              ))}
            </div>
            <div className="category">
              <label htmlFor="negativeProgramName"> Unwanted Program: </label>
              {negativeProgramNames.map(negativeProgram => (
                <label key={negativeProgram}>
                  <input
                    type="checkbox"
                    name="negativeProgramName"
                    value={negativeProgram}
                    checked={formData.negativeProgramName.includes(negativeProgram)}
                    onChange={handleChange}
                  />
                  {negativeProgram}
                </label>
              ))}
            </div>
            <div className="category">
              <label htmlFor="InstructionalStyle"> Instructional Style: </label>
              {instructionalStyles.map(style => (
                <label key={style}>
                  <input
                    type="checkbox"
                    name="InstructionalStyle"
                    value={style}
                    checked={formData.InstructionalStyle.includes(style)}
                    onChange={handleChange}
                  />
                  {style}
                </label>
              ))}
            </div>
            <div className="category">
              <label> Foreign Language: </label>
              {foreignLanguages.map(language => (
                <label key={language}>
                  <input
                    type="radio"
                    name="ForeignLanguage"
                    value={language}
                    checked={formData.ForeignLanguage === language}
                    onChange={handleChange}
                  />
                  {language}
                </label>
              ))}
            </div>
            <div className="category">
              <label htmlFor="courseTitle"> Wanted Course Name: </label>
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
            <div className="category">
              <label htmlFor="negativeCourseTitle"> Unwanted Course Name: </label>
              <input
                type="text"
                id="negativeCourseTitle"
                name="negativeCourseTitle"
                value={negativeCourseTitleInput} 
                onChange={handleNegativeInputChange}
              />

              {negativeSelectedCourses.map(negativeCourse => (
                <div key={negativeCourse}>
                  <p>{negativeCourse}</p>
                </div>
              ))}

              {negativeSuggestedOptions.map(option => (
                <div key={option.courseId}>
                  <button
                    className="negative-suggested-option"
                    onClick={(e) => handleNegativeSuggestedOptionClick(option.negativeCourseTitle, e)}
                  >
                    {option.negativeCourseTitle}
                  </button>
                </div>
              ))}

            </div>
          </div>
          <br /><br />
          <input className="preferences-button" type="submit" value="Submit" />
        </form>
      </section>
    </div>
  );
}

export default Preferences;

const programNames = [
  "Accounting", "Anthropology", "Art", "Art History", "Biology",
  "Business Administration", "Chemistry", "Chinese", "Classics", "Computer Science",
  "Digital Arts and Media", "Economics", "English", "Environmental Studies",
  "Health and Exercise Science", "French", "History", "Mathematics", "Music", "Natural Sciences",
  "Neuroscience", "Philosophy", "Physics", "Psychology", "Spanish", "Writing Rhetoric and Communication"
];

const negativeProgramNames = [
  "Accounting", "Anthropology", "Art", "Art History", "Biology",
  "Business Administration", "Chemistry", "Chinese", "Classics", "Computer Science",
  "Digital Arts and Media", "Economics", "English", "Environmental Studies",
  "Health and Exercise Science", "French", "History", "Mathematics", "Music", "Natural Sciences",
  "Neuroscience", "Philosophy", "Physics", "Psychology", "Spanish", "Writing Rhetoric and Communication"
];

const instructionalStyles = [
  "Applied Music", "Lecture", "PE Activity", "Practicum", "Studio Art", "Team Taught",
];

const foreignLanguages = [
  "Chinese", "French", "Spanish",
];





