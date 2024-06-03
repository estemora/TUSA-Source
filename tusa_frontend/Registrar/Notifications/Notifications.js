import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../tusastyles.css';
import './notificationsstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import axios from 'axios'; 

function Notifications() {
  const [formData, setFormData] = useState({
    id: '',
    subject: '',
    body: '',
  });
  const [newMessageSender, setNewMessageSender] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error message
  const [newNotification, setNewNotification] = useState(''); // State for new notification content

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
      fetchNotifications(username);
    }
  }, []);

  const receiveNewMessage = (sender) => {
    setNewMessageSender(sender);
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/markAsRead.cgi`,
        {
          id: id
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
          }
        }
      );
  
      // Display alert that notification is marked as read
      toast.success('Notification marked as read.');
        
      // Refetch notifications
      fetchNotifications(username);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const pushNotification = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/createNotification.cgi`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response.data);
      fetchNotifications(username); 
      toast.success('Notification successfully sent!');
      // Clear the form after successful submission
      setFormData({
        id: '',
        subject: '',
        body: '',
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      setErrorMessage('Failed to create notification. Please try again later.');
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchNotifications = async (username) => {
    console.log(username)
    try {
      const response = await axios.get(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/notifications.cgi?username=${username}`,
      );
      console.log('Current Notifications:', response);
  
      if (Array.isArray(response.data)) { // Check if response data is an array
        // Filter out notifications that are already read or were marked as read
        const filteredNotifications = response.data.filter(notification => !readNotificationIds.includes(notification.id));
  
        // Check if there are any unread notifications
        const hasUnreadNotifications = filteredNotifications.some(notification => !notification.read);
        if (hasUnreadNotifications) {
          receiveNewMessage(filteredNotifications[0].sender);
        }
  
        if (hasUnreadNotifications) {
          setNotifications(filteredNotifications);
          setLoading(false); // Update loading status
        } else {
          setLoading(false); // No notifications to load
        }
      } else {
        console.error('Error fetching notifications: Response data is not an array');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDelete = async (notifId) => {
    console.log('Notif Id:', notifId);
    try {
      await axios.post(
        'http://www.cs.transy.edu/TUSA/js-login/front/build/deleteNotification.cgi',
        `notifId=${notifId}`, // Use 'id' as the parameter name
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      fetchNotifications(username); // Fetch notifications again after deletion
    } catch (error) {
      fetchNotifications(username); // Fetch notifications again after deletion
      console.error('Error deleting notification:', error);
      setErrorMessage('Failed to delete notification. Please try again later.');
    }
  };
  

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <section className="notifications-title">
          <p className="notifications-text"> NOTIFICATIONS </p>
        </section>
        <br /> 
        <Link to="/student-received-notes" className="navigate-button">
            View Notes
          </Link>
        <br/>
        <section className="notifications-section">
          <br />
          <div className="notif-card">
            <br/>
            <h2>Send Notification</h2>
            <form onSubmit={pushNotification}>
              <div className="notif-subject-box">
                <label>Subject:</label> <br/>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                /> <br />
              </div>
              <div>
                <label>Message:</label> <br/>
                <textarea
                name="body" 
                value={formData.body}
                onChange={handleInputChange}
                required
              /> <br />
              </div>
              <button type="submit">Send Notification</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <br />
          {!loading && notifications.length === 0 && (
            <p>You currently have no new notifications.</p>
          )}
          {!loading && notifications.length > 0 && (
            <>
              <div className="notification">
                <ul>
              {notifications.map((notification, index) => (
                <li key={index}>
                  {notification.sender === 'registrar' ? (
                    <>
                      <span>{notification.subject}</span>
                      <div>{notification.body}</div>
                    </>
                  ) : (
                    <>
                      <span>{notification.sender} sent you a new message!</span>
                      <button className="mark-read" onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(notification.id)}>Delete</button>
                </li>
              ))}
                </ul>
              </div>
            </>
          )}
          <br />
        </section>
      </div>
    </div>
  );
}

export default Notifications;








