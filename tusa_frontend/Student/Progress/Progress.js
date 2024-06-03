import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../tusastyles.css';
import './progressstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import { toast } from 'react-toastify';

function Progress() {
  const [coursesTaken, setCoursesTaken] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
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
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    if (username) {
      console.log('Username:', username); 
      fetchCoursesTaken();
    }
  }, [username]);  

  const fetchCoursesTaken = async () => {
    try {
      const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showProgress.cgi?username=${username}`);
      console.log('Response:', response.data); 
      
      if (Array.isArray(response.data)) {
        const coursesTakenData = response.data;
        
        const courseTitles = coursesTakenData.map(courseData => courseData.title);
        console.log('Course Titles:', courseTitles); 
        
        setCoursesTaken(courseTitles);
        
        const totalCredits = coursesTakenData.reduce((total, courseData) => total + courseData.credits, 0);
        setTotalCredits(totalCredits);
        console.log('Total credits:', totalCredits);
      }
    } catch (error) {
      console.error('Error fetching courses taken:', error);
    }
  };
  

  const handleDelete = async (courseTitle) => {
    try {
      console.log("Course:", courseTitle);
  
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/deletePreviousCourse.cgi',
        {
          username: username,
          courseTitle: courseTitle,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.status === 200) {
        fetchCoursesTaken(username);
        toast(`"${courseTitle}" deleted successfully!`);
      } else {
        alert(`Failed to delete "${courseTitle}".`);
      }
    } catch (error) {
      console.error(`Error deleting "${courseTitle}":`, error);
      alert(`Error deleting "${courseTitle}". Please try again later.`);
    }
  };
  
  
  
  
  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="progress-title">
            <p className="progress-text"> PROGRESS </p>
          </section>
          <br />
          <br />
          <Link to="/student-previouscourses" className="add-button">
            + Add Previous Courses
          </Link>
          <br />
          <div className="credits">
            <a>{totalCredits} of 36</a>
          </div>
          <br />
          <section className="progress-bar">
            {Array.from({ length: Math.min(totalCredits, 36) }, (_, index) => {
              const fractional = totalCredits - Math.floor(totalCredits); 
              let className = 'progress-bar-item';
              if (fractional > 0 && index === Math.floor(totalCredits) - 1) {
                className += ' fractional-progress';
              }
              return <div key={index} className={className}></div>;
            })}
        </section>
          <div className="taken-section">
          <h2>Courses Taken:</h2>
            <ul> 
              {coursesTaken.map((courseTitle, index) => (
                <li key={index}>
                  {courseTitle}
                  <button className="delete-prevcourse" onClick={() => handleDelete(courseTitle)}>Delete</button>
                </li> 
              ))}
            </ul>
          </div>
          <br />
        </main>
      </div>
    </div>
  );    
}  

export default Progress;








