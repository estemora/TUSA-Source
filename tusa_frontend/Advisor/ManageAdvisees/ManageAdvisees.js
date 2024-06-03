import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adviseestyles.css';
import '../tusastyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function ManageAdvisees() {
    const [advisees, setAdvisees] = useState([]);
    const [username, setUsername] = useState('');
    const [fetchedSchedule, setFetchedSchedule] = useState({});
    const [expandedSchedule, setExpandedSchedule] = useState(null);

    useEffect(() => {
        const cookieString = document.cookie;
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
            fetchAdvisees(username);
        }
    }, [username]);

    const fetchSchedule = async (username) => {
        try {
            const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/displaySavedSchedule.cgi?username=${username}`);
            const formattedSchedule = formatSchedule(response.data);
            setFetchedSchedule(prevState => ({ ...prevState, [username]: formattedSchedule }));
            toggleExpandedSchedule(username);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    function formatSchedule(schedule) {
        const formattedSchedule = {};

        for (const key in schedule) {
            const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
            const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
            formattedSchedule[capitalizedKey] = schedule[key].map(course => ({
                course_name: course.course_name,
                course_title: course.course_title,
                course_representation: course.course_representation,
                credits: course.credits
            }));
        }

        return formattedSchedule;
    }

    const fetchAdvisees = async (username) => {
        try {
            const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showAdvisees.cgi?username=${username}`);
            setAdvisees(response.data);
        } catch (error) {
            console.error('Error fetching courses taken:', error);
        }
    };

    const toggleExpandedSchedule = (username) => {
        setExpandedSchedule(prevState => (prevState === username ? null : username));
    };

    return (
        <div>
            <Header />
            <div className="below-nav">
                <NavBar />
                <main>
                    <section className="title">
                        <p className="title-text"> MANAGE ADVISEES </p>
                    </section>
                    {advisees.map((advisee, index) => (
                        <div className="auto-schedule-card" key={index}>
                            <div className="advisee-name" onClick={() => fetchSchedule(advisee)} style={{ cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>{advisee}</div>
                            {expandedSchedule === advisee && fetchedSchedule[advisee] && Object.keys(fetchedSchedule[advisee]).length > 0 && (
                                <div>
                                    <br />
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
                                                {Object.keys(fetchedSchedule[advisee]).map((season, seasonIndex) => (
                                                    <>
                                                        {fetchedSchedule[advisee][season].map((course, courseIndex) => (
                                                            <tr key={`saved-course-${seasonIndex}-${courseIndex}`}>
                                                                {courseIndex === 0 && <td rowSpan={fetchedSchedule[advisee][season].length}>{season}</td>}
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
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

export default ManageAdvisees;





