import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './coursesstyles.css';
import NavBar from '../NavBar';
import Header from '../Header';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AllCourses() {
    const [courses, setCourses] = useState([]);
    const [username, setUsername] = useState('');
    const [students, setStudents] = useState([]);
    const [expandedStudents, setExpandedStudents] = useState(null);

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
            fetchCourses(username);
        }
    }, [username]);

    const fetchCourses = async (username) => {
	try {
	    const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showCourses.cgi?username=${username}`);
	    console.log('Response:', response.data);
	    if(Array.isArray(response.data)) {
		const courseTitles = response.data;
		console.log('Course Titles:', courseTitles);
		setCourses(courseTitles);
	    };
	} catch (error) {
	    console.error('Error fetching courses taken:', error);
	}
    };

    const showStudents = async (courseCode) => {
	try {
	    const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showStudents.cgi?courseTitle=${courseCode}`);
	    console.log('Response:', response.data);
	    const studentsEnrolled = response.data;
	    console.log('Students Enrolled:', studentsEnrolled);
	    setStudents(prevState => ({
		...prevState,
		[courseCode]: studentsEnrolled
	    }));
	    toggleExpandedStudents(courseCode);
	} catch (error) {
	    console.error('Error fetching students enrolled:', error);
	}
    };
    
    const toggleExpandedStudents = (courseTitle) => {
        setExpandedStudents(prevState => (prevState === courseTitle ? null : courseTitle));
    };

    const handleDelete = async (courseTitle) => { // Mark as async
	try {
	    const formData = new FormData();
            formData.append('username', username);
            formData.append('courseTitle', courseTitle);

            const response = await axios.post('http://www.cs.transy.edu/TUSA/js-login/front/build/deleteMyCourse.cgi', formData);

	    console.log('Response:', response.data);
	    if (response.status === 200) {
                fetchCourses(username); // Pass username to fetchCourses
		toast(`"${courseTitle}" deleted successfully!`);
            } else {
                alert(`Failed to delete course.`);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="below-nav">
                <NavBar />
                <main>
                    <section className="title">
                        <p className="title-text"> MY COURSES </p>
                    </section>
                    <Link to="/professor-add-my-courses" className="add-course-button">
                        + Add My Courses
                    </Link> <br /><br />
		    <div className = "add-courses-section">
			{courses.length > 0 ? (
			    <div>
				{courses.map((courseTitle, index) => (
				    <div className="auto-schedule-card" key={index}>
					<div className="course-title" onClick={() => showStudents(courseTitle)}>
					    {courseTitle}
					</div>
					<div className="delete-my-course" onClick={() => handleDelete(courseTitle)}>
					    <p> Delete </p>
					</div>
					{expandedStudents === courseTitle && students[courseTitle] && Object.keys(students[courseTitle]).length > 0 && (
					    <div>
						<p> Students Interested: </p>
						{students[courseTitle].map((student, index) => (
						    <div key={index}>{student}</div>
						))}
					    </div>
					)}
					
				    </div>
				))}
			    </div>
			) : (
			    <p>No Current Courses</p>
			)}
			
		    </div>
		    <br /><br />
		</main>
	    </div>
	</div>
    );
}

export default AllCourses;
