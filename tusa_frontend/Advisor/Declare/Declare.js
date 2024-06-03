import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../tusastyles.css';
import './declarestyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

function DeclareForm() {
  const [username, setUsername] = useState('');
  const [declarations, setDeclarations] = useState([]);
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');

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
      setUsername(user);
      fetchDeclarations(user);
    }
  }, []);

  const fetchDeclarations = async (user) => {
    try {
      const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showDeclaration.cgi?username=${user}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setDeclarations(response.data);
    } catch (error) {
      console.error('Error fetching declarations:', error);
    }
  };  

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name === 'majors') {
      setMajor(value);
    } else if (name === 'minors') {
      setMinor(value);
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      if (major) {
        await makeDeclaration(major, 'Major');
      }
      if (minor) {
        await makeDeclaration(minor, 'Minor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }; 

  const makeDeclaration = async (program, type) => {
    try {
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/declare.cgi',
        {
          username: username,
          program: program,
          majorOrMinor: type
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      if (response.status === 200) {
        alert(`${type} Declaration Made!`);
        fetchDeclarations(username);
        setMajor('');
        setMinor('');
      } else {
        alert(`Failed to make ${type.toLowerCase()} declaration.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleDelete = async (program, type) => {
    try {
      console.log("Program:", program);
      console.log("Major or Minor:", type);
  
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/deleteProgram.cgi',
        {
          username: username,
          program: program,
          majorOrMinor: type
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.status === 200) {
        alert(`"${program}" deleted successfully`);
        fetchDeclarations(username);
      } else {
        alert(`Failed to delete "${program}".`);
      }
    } catch (error) {
      console.error(`Error deleting "${program}":`, error);
      alert(`Error deleting "${program}". Please try again later.`);
    }
  };
  
  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="declare-title">
            <p className="declare-text"> DECLARE MAJORS(S)/MINOR(S) </p>
          </section>
        </main>
        <br />
        <div className="declare-section">
          <form className="declare-form" onSubmit={submitForm}>
            <div className="declare-card">
              <label htmlFor="majors">
                <h3> Major: </h3>
              </label>
              <select name="majors" id="majors" onChange={handleInput} value={major} className="declare-select">
              <option value=""></option>
              <option value="undecided">Undecided</option>
              <option value="accounting">Accounting</option>
              <option value="anthropology">Anthropology</option>
              <option value="artStudio">Art (Studio)</option>
              <option value="artHistory">Art History</option>
              <option value="BIO">Biology</option>
              <option value="molecularCellular">Biology: Molecular and Cellular Track</option>
              <option value="evolutionEcologyBehavior">Biology: Evolution, Ecology, & Behavior Track</option>
              <option value="businessAdministration">Business Administration</option>
              <option value="finance">Business Administration: Finance Track</option>
              <option value="hospitalityTourism">Business Administration: Hospitality & Tourism Track</option>
              <option value="management">Business Administration: Management Track</option>
              <option value="marketing">Business Administration: Marketing Track</option>
              <option value="chemistry">Chemistry</option>
              <option value="biochemistry">Chemistry: Biochemistry Track</option>
              <option value="chineseStudies">Chinese Studies</option>
              <option value="classics">Classics</option>
              <option value="CS">Computer Science</option>
              <option value="digitalArtsMedia">Digital Arts and Media</option>
              <option value="economics">Economics</option>
              <option value="educationElementaryP5">Education-Elementary: P-5 Cert.</option>
              <option value="educationElementary59">Education-Elementary: 5-9 Cert.</option>
              <option value="educationSocialChange">Education and Social Change</option>
              <option value="english">English</option>
              <option value="french">French Language and Literature</option>
              <option value="germanStudies">German Studies</option>
              <option value="healthExerciseScience">Health and Exercise Science</option>
              <option value="history">History</option>
              <option value="internationalAffairsDevelopment">International Affairs: Development Track</option>
              <option value="internationalAffairsDiplomacy">International Affairs: Diplomacy Track</option>
              <option value="internationalAffairsCultures">International Affairs: Comparative Cultures Track</option>
              <option value="mathematics">Mathematics</option>
              <option value="musicEducation">Music Education</option>
              <option value="musicPerformance">Music Performance</option>
              <option value="musicStudies">Music Studies</option>
              <option value="musicTechnology">Music Technology</option>
              <option value="neuroscienceBiology">Neuroscience: Biology Emphasis</option>
              <option value="neuroscienceComputerScience">Neuroscience: Computer Science Emphasis</option>
              <option value="neurosciencePsychology">Neuroscience: Psychology Emphasis</option>
              <option value="philosophy">Philosophy</option>
              <option value="philosophyPoliticsEconomics">Philosophy, Politics, and Economics (PPE)</option>
              <option value="physics">Physics</option>
              <option value="politicalScience">Political Science</option>
              <option value="psychology">Psychology</option>
              <option value="religion">Religion</option>
              <option value="selfDesignedMajor">Self-Designed Major</option>
              <option value="sociology">Sociology</option>
              <option value="sociologyAnthropology">Sociology/Anthropology</option>
              <option value="spanish">Spanish Language and Literature</option>
              <option value="teachingArt">Teaching Art</option>
              <option value="teachingChemistry">Teaching Chemistry</option>
              <option value="teachingPhysicalEducation">Teaching Physical Education</option>
              <option value="theaterArts">Theater Arts</option>
              <option value="theaterDesign">Theater Design</option>
              <option value="theaterPerformance">Theater Performance</option>
              <option value="writingRhetoricCommunication">Writing, Rhetoric, and Communication</option>
              </select>
            </div>
            <button type="submit" className="declare-button">Submit Declarations</button>
          </form>
        </div>
  <div className="declared-section">
  <h2>Declarations:</h2>
  <ul>
    {declarations.map((declaration, index) => (
      <li key={index}>
        {declaration.program} {declaration.majorOrMinor}
        <button className="delete-program" onClick={() => handleDelete(declaration.program, declaration.majorOrMinor === 'Minor' ? 'Minor' : 'Major')}>Delete</button>
      </li>
           ))}
          </ul>
        </div>
      <br />
      </div>
    </div>
  );
}

export default DeclareForm;


