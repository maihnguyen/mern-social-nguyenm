import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { listUserEvents } from './api-event';
import auth from '../auth/auth-helper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteEvent } from './api-event';

function EventList({ history }) {
  const [events, setEvents] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    listUserEvents({ t: jwt.token }).then(data => {
      if (data.error) console.error(data.error);
      else setEvents(data);
    });
  }, []);

  const handleEdit = (eventId) => {
    history.push(`/events/edit/${eventId}`);
  };

  const handleDelete = (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;
  
    const jwt = auth.isAuthenticated();
    deleteEvent(eventId, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        setEvents(events.filter(event => event._id !== eventId));
      }
    });
  };

  return (
    <Box style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>My Events</Typography>

      <Box style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/events/create" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">Create Event</Button>
        </Link>
        <Link to="/events/invitations" style={{ textDecoration: 'none' }}>
          <Button variant="contained">View Invitations</Button>
        </Link>
      </Box>

      {events.length === 0 ? (
        <Typography>No events found. Try creating one!</Typography>
      ) : (
        <List>
          {events.map(event => (
            <ListItem key={event._id} divider>
              <ListItemText
                primary={event.title}
                secondary={`📍 ${event.location} | 🗓️ ${event.date} | ⏰ ${event.time}`}
              />
              {event.creatorId === jwt.user._id && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="primary" onClick={() => history.push(`/events/edit/${event._id}`)}>
                    <EditIcon/>
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(event._id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default withRouter(EventList);
