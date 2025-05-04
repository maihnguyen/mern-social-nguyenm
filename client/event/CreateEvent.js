import React, { useState, useEffect } from 'react';
import auth from '../auth/auth-helper';
import { createEvent } from './api-event';
import { read } from '../user/api-user';
import {
  Box, Button, TextField, Typography, FormGroup, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export default function CreateEvent() {
  const [values, setValues] = useState({
    title: '', description: '', date: '', time: '', location: '',
    invitedUsers: [],
    following: []
  });

  const jwt = auth.isAuthenticated();
  const history = useHistory();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    read({ userId: jwt.user._id }, { t: jwt.token }, signal)
      .then(data => {
        if (data && data.following) {
          setValues(v => ({ ...v, following: data.following }));
        }
      });

    return () => controller.abort();
  }, []);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheckboxToggle = userId => () => {
    const updated = values.invitedUsers.includes(userId)
      ? values.invitedUsers.filter(id => id !== userId)
      : [...values.invitedUsers, userId];
    setValues({ ...values, invitedUsers: updated });
  };

  const clickSubmit = () => {
    const event = {
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time,
      location: values.location,
      invitedUsers: values.invitedUsers
    };

    createEvent(event, { t: jwt.token }).then(data => {
        if (data.error) {
            console.error('Failed to create event:', data.error);
        } else {
            alert('Event created successfully');
            history.push('/events');  // Redirect here
        }
    });
  };

  return (
    <Box style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Create Event</h2>
      <TextField fullWidth label="Title" value={values.title} onChange={handleChange('title')} margin="normal" required />
      <TextField fullWidth label="Description" value={values.description} onChange={handleChange('description')} margin="normal" />
      <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={values.date} onChange={handleChange('date')} margin="normal" required />
      <TextField fullWidth type="time" label="Time" InputLabelProps={{ shrink: true }} value={values.time} onChange={handleChange('time')} margin="normal" required />
      <TextField fullWidth label="Location" value={values.location} onChange={handleChange('location')} margin="normal" />

      <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>Invite Users You Follow:</Typography>
      <FormGroup>
        {values.following.map(user => (
          <FormControlLabel
            key={user._id}
            control={
              <Checkbox
                checked={values.invitedUsers.includes(user._id)}
                onChange={handleCheckboxToggle(user._id)}
                color="primary"
              />
            }
            label={user.name}
          />
        ))}
      </FormGroup>

      <Button variant="contained" color="primary" onClick={clickSubmit} style={{ marginTop: '1rem' }}>
        Create
      </Button>
    </Box>
  );
}
