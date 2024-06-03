import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../tusastyles.css';
import './calstyles.css';
import NavBar from '../NavBar';
import Header from '../Header';

const localizer = momentLocalizer(moment);

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [event, setEvent] = useState({
    start: null,
    end: null,
    title: '',
    description: ''
  });
  const [username, setUsername] = useState('');
  const [isSchoolEvent, setIsSchoolEvent] = useState(false); // State for the checkbox

  useEffect(() => {
    // Fetch events and username on component mount
    const cookieString = document.cookie;
    console.log('Cookie String:', cookieString);
    const cookies = cookieString.split(';');
    console.log('Individual Cookies:', cookies);
    let user = '';
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      console.log('Cookie Name:', name);
      console.log('Cookie Value:', value);
      if (name === 'username') {
        user = value;
      }
    });
    if (user) {
      setUsername(user);
      fetchEvents(user);
    }
  }, []);

  // Function to fetch events
  const fetchEvents = async (username) => {
    try {
      console.log('Fetching events for username:', username);
      const url = `http://www.cs.transy.edu/TUSA/js-login/front/build/showEvents.cgi`;
      console.log('Request URL:', url);
      const response = await axios.post(
        url,
        { username },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Response:', response);
      if (Array.isArray(response.data)) {
        const formattedEvents = response.data.map(event => {
          const formattedStartTime = new Date(event.eventStartTime).toISOString();
          const formattedEndTime = new Date(event.eventEndTime).toISOString();
          return {
            ...event,
            title: event.eventTitle,
            start: new Date(formattedStartTime),
            end: new Date(formattedEndTime)
          };
        });
        console.log('Formatted Events:', formattedEvents);
        setEvents(formattedEvents);
      } else {
        console.error('Response data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Function to toggle the form visibility
  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const titleMaxLength = 30;
    const descriptionMaxLength = 50;
    if (name === 'title' && value.length > titleMaxLength) {
      alert(`Title must be ${titleMaxLength} characters or fewer.`);
      return;
    }
    if (name === 'description' && value.length > descriptionMaxLength) {
      alert(`Description must be ${descriptionMaxLength} characters or fewer.`);
      return;
    }
    setEvent({ ...event, [name]: value });
  };

  // Function to handle event deletion
  const handleDeleteEvent = async (event) => {
    try {
      console.log('Deleting event:', event);
      const formattedEvent = {
        ...event,
        username,
        eventStartTime: moment(event.eventStartTime).format('YYYY-MM-DD HH:mm:ss'),
        eventEndTime: moment(event.eventEndTime).format('YYYY-MM-DD HH:mm:ss')
      };
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/deleteEvent.cgi`,
        formattedEvent,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Event deleted successfully:', response.data);
      await fetchEvents(username);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again later.');
    }
  };

  // Function to handle adding events
  const handleAddEvent = async (e) => {
    e.preventDefault();
    console.log('Adding event:', event);
    if (event.start >= event.end) {
      alert('Start date must be before end date.');
      return;
    }
    try {
      const formattedStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
      const formattedEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss');
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/addEvent.cgi`,
        {
          ...event,
          username,
          start: formattedStart,
          end: formattedEnd
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Response:', response.data);
      console.log('Event added successfully.');
      await fetchEvents(username);
      resetEventForm();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again later.');
    }
  };

  // Function to reset the event form
  const resetEventForm = () => {
    setEvent({
      start: null,
      end: null,
      title: '',
      description: ''
    });
    setShowForm(false);
  };

  // Function to handle adding school events
  const handleAddSchoolEvent = async (e) => {
    e.preventDefault();
    console.log('Adding school event:', event);
    if (event.start >= event.end) {
      alert('Start date must be before end date.');
      return;
    }
    try {
      const formattedStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
      const formattedEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss');
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/addRegistrarEvent.cgi`,
        {
          ...event,
          username,
          start: formattedStart,
          end: formattedEnd
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Response:', response.data);
      console.log('School event added successfully.');
      await fetchEvents(username);
      resetEventForm();
    } catch (error) {
      console.error('Error adding school event:', error);
      await fetchEvents(username);
    }
  };

  const handleDeleteSchoolEvent = async (event) => {
    try {
      console.log('Deleting event:', event);
      const formattedEvent = {
        ...event,
        username,
        eventStartTime: moment(event.eventStartTime).format('YYYY-MM-DD HH:mm:ss'),
        eventEndTime: moment(event.eventEndTime).format('YYYY-MM-DD HH:mm:ss')
      };
      const response = await axios.post(
        `http://www.cs.transy.edu/TUSA/js-login/front/build/deleteRegistrarEvent.cgi`,
        formattedEvent,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Event deleted successfully:', response.data);
      await fetchEvents(username);
    } catch (error) {
      await fetchEvents(username);
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <div className="below-nav">
        <NavBar />
        <section className="cal-title">
          <p className="cal-text">CALENDAR</p>
        </section>
        <div className="container-calendar">
          <div>
            <button className="create-event" onClick={handleFormToggle}>+</button>
            <div className={`form-popup ${showForm ? 'show' : ''}`} id="addEvent">
              <div id="event-section">
                <h3>
                  Add Event
                  <button type="button" className="cancel-button" onClick={handleFormToggle}>Cancel</button>
                </h3>
                <br />
                <div className="event-form">
                  <div className="datetime-container">
                    <DatePicker
                      selected={event.start}
                      onChange={(date) => setEvent({ ...event, start: date })}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="Start Date & Time"
                      className="input-box"
                    />
                    <DatePicker
                      selected={event.end}
                      onChange={(date) => setEvent({ ...event, end: date })}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="End Date & Time"
                      className="input-box"
                    />
                  </div>
                  <input className="input-box" type="text" name="title" value={event.title} onChange={handleInputChange} placeholder="Event Title" />
                  <input className="input-box" type="text" name="description" value={event.description} onChange={handleInputChange} placeholder="Event Description" />
                  <br />
                  <label>
                    <input type="checkbox" checked={isSchoolEvent} onChange={() => setIsSchoolEvent(!isSchoolEvent)} />
                    Is School Event
                  </label>
                  <button className="create-event-button" id="createEvent" onClick={isSchoolEvent ? handleAddSchoolEvent : handleAddEvent}>
                    {isSchoolEvent ? 'Add School Event' : 'Add Event'}
                  </button>
                </div>
              </div>
            </div>
            <div id="reminder-section">
              <h3>Events</h3>
              <ul>
            {events.map((event, index) => (
              <li key={index}>
                <div>
                  {`${event.eventTitle} : ${event.eventDescription} at ${moment(event.eventStartTime).format('MMMM Do YYYY, h:mm a')} - ${moment(event.eventEndTime).format('MMMM Do YYYY, h:mm a')}`}
                  {event.username === 'registrar' ? ( // Check if it's associated with the 'registrar' user
                    <button className="delete-event" onClick={() => handleDeleteSchoolEvent(event)}>Delete</button>
                  ) : (
                    <button className="delete-event" onClick={() => handleDeleteEvent(event)}>Delete</button>
                  )}
                </div>
                <br />
              </li>
            ))}

              </ul>
            </div>
          </div>
          <div>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: '50px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;

