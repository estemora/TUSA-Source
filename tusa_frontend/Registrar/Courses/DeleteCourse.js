import React, { useState, useEffect } from 'react';
import {
    Button,
    Confirm,
    useRecordContext,
    useDelete,
    Admin, defaultTheme
} from 'react-admin';
import '../tusastyles.css';
import './catalogstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import axios from 'axios';

function DeleteCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedProgram, selectedYear, selectedSemester, searchTerm]);

  useEffect(() => {
    if (courses.length > 0) {
      const sortedCourses = [...courses].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setFilteredCourses(sortedCourses);
    }
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://www.cs.transy.edu/TUSA/js-login/front/build/showCatalog.cgi', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedProgram) {
      filtered = filtered.filter(course => course.program === selectedProgram);
    }

    if (selectedYear) {
      if (selectedYear === 'allOnly') {
        filtered = filtered.filter(course => course.year === 'ALL');
      } else if (selectedYear === 'all') {
        filtered = filtered.filter(course => course.year === 'ODD' || course.year === 'EVEN' || course.year === 'ALL');
      } else if (selectedYear === 'evenOnly') {
        filtered = filtered.filter(course => course.year === 'EVEN');
      } else if (selectedYear === 'oddOnly') {
        filtered = filtered.filter(course => course.year === 'ODD');
      } else if (selectedYear === 'even') {
        filtered = filtered.filter(course => course.year === 'EVEN' || course.year === 'ALL');
      } else if (selectedYear === 'odd') {
        filtered = filtered.filter(course => course.year === 'ODD' || course.year === 'ALL');
      } else {
        filtered = filtered.filter(course => course.year === selectedYear);
      }
    }

    if (selectedSemester) {
      if (selectedSemester === 'fall') {
        filtered = filtered.filter(course => course.semester === 'FALL' || course.semester === 'WI&FA' || course.semester === 'FA&WI' || course.semester === 'FA&MA' || course.semester === 'MA&FA');
      } else if (selectedSemester === 'winter') {
        filtered = filtered.filter(course => course.semester === 'WNTER' || course.semester === 'WI&MA' || course.semester === 'MA&WI' || course.semester === 'WI&FA' || course.semester === 'FA&WI' || course.semester === 'WIMAY');
      } else if (selectedSemester === 'may') {
        filtered = filtered.filter(course => course.semester === 'MAY' || course.semester === 'WI&MA' || course.semester === 'MA&WI' || course.semester === 'FA&MA' || course.semester === 'MA&FA' || course.semester === 'WIMAY');
      } else if (selectedSemester === 'fallAndWinter') {
        filtered = filtered.filter(course => course.semester === 'FALL' || course.semester === 'WNTER' || course.semester === 'WI&FA' || course.semester === 'FA&WI');
      } else if (selectedSemester === 'fallAndMay') {
        filtered = filtered.filter(course => course.semester === 'FALL' || course.semester === 'MAY' || course.semester === 'FA&MA' || course.semester === 'MA&FA');
      } else if (selectedSemester === 'winterAndMay') {
        filtered = filtered.filter(course => course.semester === 'WNTER' || course.semester === 'MAY' || course.semester === 'WI&MA' || course.semester === 'MA&WI'|| course.semester === 'WIMAY');
      } else if (selectedSemester === 'fallOnly') {
        filtered = filtered.filter(course => course.semester === 'FALL');
      } else if (selectedSemester === 'winterOnly') {
        filtered = filtered.filter(course => course.semester === 'WNTER');
      } else if (selectedSemester === 'mayOnly') {
        filtered = filtered.filter(course => course.semester === 'MAY');
      } else if (selectedSemester === 'fallAndWinterOnly') {
        filtered = filtered.filter(course => course.semester === 'WI&FA' || course.semester === 'FA&WI');
      } else if (selectedSemester === 'fallAndMayOnly') {
        filtered = filtered.filter(course => course.semester === 'FA&MA' || course.semester === 'MA&FA');
      } else if (selectedSemester === 'winterAndMayOnly') {
        filtered = filtered.filter(course => course.semester === 'WI&MA' || course.semester === 'WIMAY');
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const sortCourses = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedCourses = [...filteredCourses].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredCourses(sortedCourses);
  };

    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const handleConfirm = (courseID) => {
	//handleDelete(courseID);
	setOpen(false);
    };

    const handleDeleteConfirmation = (courseID) => {
	if(window.confirm(`Are you sure you want to delete this course?`)) {
	    handleDelete(courseID);
	}
    };

    const handleDelete = async (courseID) => {
	try {
	    const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/DeleteACourse.cgi?courseID=${courseID}`);
	    if (response.status === 200) {
		alert('Course Deleted Successfully!');
	    } else {
		alert('Course Failed to Delete :(');
	    }
	} catch (error) {
	    console.error('Error:', error);
	    alert('An error occurred. Please try again later.');
	}
    };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <div className="below-nav">
            <section className="title">
              <p className="title-text"> DELETE INDIVIDUAL COURSES </p>
            </section>
            <br />
            <section className="catalog-card">
              <label htmlFor="program">Filter by Program:</label>
              <select id="program" className="catalog-select" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
                <option value=""></option>
                <option value="MATH">Math</option>
                <option value="BIO">Biology</option>
                <option value="CHEM">Chemistry</option>
                <option value="CS">Computer Science</option>
                <option value="CLA">Classics</option>
                <option value="SPAN">Spanish</option>
                <option value="PHYS">Physics</option>
                <option value="PSY">Psychology</option>
                <option value="HIST">History</option>
                <option value="PHIL">Philosophy</option>
                <option value="ENG">English</option>
                <option value="HES">Health</option>
                <option value="ARTH">Art History</option>
                <option value="ECON">Economics</option>
                <option value="MUS">Music</option>
              </select>
            </section>
            <section className="catalog-card">
              <label htmlFor="year">Filter by Year:</label>
              <select id="year" className="catalog-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value=""></option>
                <option value="all">All </option>
                <option value="odd">Odd </option>
                <option value="even">Even </option>
                <option value="allOnly">All Only</option>
                <option value="oddOnly">Odd Only</option>
                <option value="evenOnly">Even Only</option>
              </select>
            </section>
            <section className="catalog-card">
              <label htmlFor="semester">Filter by Semester:</label>
              <select id="semester" className="catalog-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value=""></option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="may">May</option>
                <option value="fallAndWinter">Fall and Winter</option>
                <option value="fallAndMay">Fall and May</option>
                <option value="winterAndMay">Winter and May</option>
                <option value="fallOnly">Fall Only</option>
                <option value="winterOnly">Winter Only</option>
                <option value="mayOnly">May Only</option>
                <option value="fallAndWinterOnly">Fall and Winter Only</option>
                <option value="fallAndMayOnly">Fall and May Only</option>
                <option value="winterAndMayOnly">Winter and May Only</option>
              </select>
            </section>
            <section className="catalog-card">
              <label htmlFor="search">Course Search: </label> <br />
              <input className="catalog-search" type="text" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </section>
            <section className="courses-section">
              <table className="horizontal-table">
                <thead>
                  <tr>
                    <th onClick={() => sortCourses('name')}>
                      <span className="text">Course Name</span>
                      {sortConfig.key === 'name' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'name' && (
                        <span className="arrow"></span>
                      )}
                    </th>
                    <th onClick={() => sortCourses('courseTitle')}>
                      <span className="text">Course Title</span>
                      {sortConfig.key === 'courseTitle' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'courseTitle' && (
                        <span className="arrow"></span>
                      )}
                    </th>
                    <th onClick={() => sortCourses('program')}>
                      <span className="text">Program</span>
                      {sortConfig.key === 'program' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'program' && (
                        <span className="arrow"></span>
                      )}
                    </th>
                    <th onClick={() => sortCourses('credits')}>
                      <span className="text">Credits</span>
                      {sortConfig.key === 'credits' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'credits' && (
                        <span className="arrow"></span>
                      )}
                    </th>
                    <th onClick={() => sortCourses('semester')}>
                      <span className="text">Semester</span>
                      {sortConfig.key === 'semester' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'semester' && (
                        <span className="arrow"></span>
                      )}
                    </th>
                    <th onClick={() => sortCourses('year')}>
                      <span className="text">Year</span>
                      {sortConfig.key === 'year' && (
                        <span className="arrow" style={{ fontSize: '20px' }}>
                          {sortConfig.direction === 'ascending' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                      {sortConfig.key !== 'year' && (
                        <span className="arrow"></span>
                      )}
                    </th>
		      
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(course => (
                    <tr key={course.courseId}>
                      <td>{course.name}</td>
                      <td>{course.courseTitle}</td>
                      <td>{course.program}</td>
                      <td>{course.credits}</td>
                      <td>{course.semester}</td>
			<td>{course.year}</td>
			<div className="delete-course-button" onClick={() => handleDeleteConfirmation(course.courseId)}>
			    <p className="delete-course-text"> Delete </p>
			</div>
			
                    </tr>
                  ))}
                </tbody>
              </table>
	      
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DeleteCourses;





