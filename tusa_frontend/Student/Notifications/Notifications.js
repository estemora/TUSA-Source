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
    sender: '',
    recipient: '',
    subject: '',
    options: '',
    body: '',
    read: ''
  });
  const [newMessageSender, setNewMessageSender] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); 
  const [hasNotifications, setHasNotifications] = useState(false);
    
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
            'Content-Type': 'application/x-www-form-urlencoded' // setting the correct content type
          }
        }
      );
  
      // Display alert that notification is marked as read
      toast.success('Notification marked as read');
        
      // Refetch notifications
      fetchNotifications(username);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
          setHasNotifications(true);
        } else {
          setLoading(false);
          setHasNotifications(false);
        }
      } else {
        console.error('Error fetching notifications: Response data is not an array');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <section className="title">
          <p className="title-text"> NOTIFICATIONS </p>
        </section>
        <br /> 
        <Link to="/student-received-notes" className="navigate-button">
            View Notes
          </Link>
        <br/>
        <section className="notifications-section">
          <br />
          {!loading && !hasNotifications && (
            <p>You currently have no new notifications</p>
          )}
          {!loading && hasNotifications && (
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
              </li>
            ))}
              </ul>
            </div>
          )}
          <br />
        </section>
      </div>
    </div>
  );
}

export default Notifications;








