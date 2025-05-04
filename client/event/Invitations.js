import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import auth from '../auth/auth-helper';
import { getInvitations, respondToInvitation } from './api-event';

export default function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    getInvitations({ t: jwt.token }).then(data => {
      if (!data.error) {
        setInvitations(data);
      } else {
        console.error(data.error);
      }
    });
  }, []);
  
  const handleResponse = (eventId, response) => {
    respondToInvitation({ eventId, response }, { t: jwt.token }).then(data => {
      if (data && !data.error) {
        // Refetch full list instead of patching manually
        getInvitations({ t: jwt.token }).then(updated => {
          if (!updated.error) {
            setInvitations(updated);
          } else {
            console.error(updated.error);
          }
        });
      } else {
        console.error(data?.error);
      }
    });
  };
  
  return (
    <Box style={{ maxWidth: 700, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>
        Event Invitations
      </Typography>

      {invitations.length === 0 ? (
        <Typography>No pending invitations.</Typography>
      ) : (
        <Paper elevation={3}>
          <List>
            {invitations.map(invite => (
              <ListItem key={invite._id} divider>
                <ListItemText
                  primary={invite.eventId.title}
                  secondary={`📍 ${invite.eventId.location} | 🗓️ ${invite.eventId.date} | ⏰ ${invite.eventId.time}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleResponse(invite.eventId._id, 'Accepted')}
                  style={{ marginRight: '0.5rem' }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleResponse(invite.eventId._id, 'Declined')}
                >
                  Decline
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
