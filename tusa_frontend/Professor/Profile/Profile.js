import React, { useState, useEffect } from 'react';
import './profilestyles.css';
import '../tusastyles.css'; 
import axios from 'axios';
import NavBar from '../NavBar';
import Header from '../Header';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    let username = '';
  
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'username') {
        username = value;
      }
    });
  
    setUsername(username);
  
    if (username) {
      fetchProfileData(username); 
    }
  }, []);

  const fetchProfileData = async (username) => {
    try {
      const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/showProfile.cgi?username=${username}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log(response);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const saveChanges = async () => {
    try {
      const response = await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/editProfile.cgi',
        {
          username,
          ...profileData
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.data.success) {
        console.log('Updated profile data:', profileData); // Log the updated profile data
        setEditMode(false);
        fetchProfileData(username);
      } else {
        console.error('Failed to update profile data:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const changeEditMode = () => {
    setEditMode(prevMode => !prevMode);
  };
    
  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <main>
          <section className="title">
            <p className="profile-text"> PROFILE </p>
          </section>
        </main>
        <div className="profile-left">
          <div className="profile-image">
            <img id="profileImage" src="./ProfilePlaceholder.png" alt="Profile" />
            <div className="edit-profile">
              {editMode ? (
                <button onClick={saveChanges} className="edit-profile-link"> Save Changes </button>
              ) : (
                <button onClick={changeEditMode} className="edit-profile-link"> Edit Profile </button>
              )}
            </div>
            <img className="laptop-image" id="laptop" src="./Laptop.png" alt="Laptop" />
          </div>
          {profileData && (
            <div className="profile-info">
              <div className="user-info">
                <p>
                  First Name: {editMode ? <input type="text" name="firstName" value={profileData.firstName || ''} onChange={handleInputChange} /> : profileData.firstName} <br />
                  Middle Name: {editMode ? <input type="text" name="middleName" value={profileData.middleName || ''} onChange={handleInputChange} /> : profileData.middleName} <br />
                  Last Name: {editMode ? <input type="text" name="lastName" value={profileData.lastName || ''} onChange={handleInputChange} /> : profileData.lastName} <br />
                  Preferred Name: {editMode ? <input type="text" name="preferredName" value={profileData.preferredName || ''} onChange={handleInputChange} /> : profileData.preferredName} <br />
                  <br />
                  Pronouns: {editMode ? <input type="text" name="preferredPronouns" value={profileData.preferredPronouns || ''} onChange={handleInputChange} /> : profileData.preferredPronouns} <br />
                  Gender Identity: {editMode ? <input type="text" name="genderIdentity" value={profileData.genderIdentity || ''} onChange={handleInputChange} /> : profileData.genderIdentity} <br />
                  <br />
                  <div className="email-info">
                    Email: {editMode ? <input type="text" name="email" value={profileData.email || ''} onChange={handleInputChange} /> : profileData.email} <br />
                    Username: {username} <br />
                    Program: {editMode ? (
                    <select
                      name="program"
                      value={profileData.program || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Program</option>
                      <option value="CS">Computer Science</option>
                      <option value="BIO">Biology</option>
                      <option value="businessAdministration">Business Administration</option>
                      <option value="digitalArtMedia">Digital Arts and Media</option>
                      <option value="french">French</option>
                    </select>
                  ) : (
                    profileData.program
                  )}
                  </div>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

