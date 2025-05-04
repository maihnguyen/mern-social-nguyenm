import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import auth from '../auth/auth-helper';
import { readEvent, updateEvent } from './api-event';
import { read } from '../user/api-user';

export default function EditEvent() {
  const { eventId } = useParams();
  const history = useHistory();
  const jwt = auth.isAuthenticated();

  const [values, setValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    invitedUsers: [],
    attendees: [],
    followingList: []
  });
  

  // Fetch event and following list on mount
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    readEvent(eventId, jwt).then((data) => {
        if (data && !data.error) {
          setValues((v) => ({
            ...v,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            invitedUsers: [...new Set(data.invitedUsers.map(u => typeof u === 'object' ? u._id : u))],
            attendees: data.attendees || []
          }));
        } else {
          console.error(data?.error);
        }
      });
      

    read({ userId: jwt.user._id }, { t: jwt.token }, signal).then((userData) => {
      if (userData && userData.following) {
        setValues((v) => ({ ...v, followingList: userData.following }));
      }
    });

    return () => abortController.abort();
  }, [eventId]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheckboxToggle = (userId) => () => {
    const currentIndex = values.invitedUsers.indexOf(userId);
    const newChecked = [...values.invitedUsers];

    if (currentIndex === -1) {
      newChecked.push(userId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setValues({ ...values, invitedUsers: newChecked });
  };

  const clickSubmit = () => {
    const updatedEvent = {
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time,
      location: values.location,
      invitedUsers: [...new Set(values.invitedUsers)] // deduplicate before sending
    };
  
    updateEvent(eventId, updatedEvent, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.error('Failed to update event:', data.error);
      } else {
        alert('Event updated successfully!');
        history.push('/events');
      }
    });
  };
  

  return (
    <Box style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>

      <TextField
        fullWidth
        label="Title"
        value={values.title}
        onChange={handleChange('title')}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={values.description}
        onChange={handleChange('description')}
        margin="normal"
      />
      <TextField
        fullWidth
        type="date"
        label="Date"
        InputLabelProps={{ shrink: true }}
        value={values.date}
        onChange={handleChange('date')}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        type="time"
        label="Time"
        InputLabelProps={{ shrink: true }}
        value={values.time}
        onChange={handleChange('time')}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Location"
        value={values.location}
        onChange={handleChange('location')}
        margin="normal"
      />

      <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
        Invited Users:
      </Typography>
      <FormGroup>
        {values.followingList.map((user) => (
          <FormControlLabel
            key={user._id}
            control={
              <Checkbox
                checked={values.invitedUsers.includes(user._id)}
                onChange={handleCheckboxToggle(user._id)}
              />
            }
            label={user.name}
          />
        ))}
      </FormGroup>

      {values.attendees.length > 0 && (
        <Box style={{ marginTop: '2rem' }}>
            <Typography variant="subtitle1">Attendees:</Typography>
            <ul>
            {values.attendees.map((attendee) =>
                <li key={typeof attendee === 'object' ? attendee._id : attendee}>
                {typeof attendee === 'object' ? attendee.name : attendee}
                </li>
            )}
            </ul>
        </Box>
        )}
      <Button
        variant="contained"
        color="primary"
        onClick={clickSubmit}
        style={{ marginTop: '1.5rem' }}
      >
        Save Changes
      </Button>
    </Box>
  );
}
