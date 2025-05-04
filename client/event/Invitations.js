import React, { useEffect, useState } from 'react';
import { getInvitations, respondToInvitation } from './api-event';
import auth from '../auth/auth-helper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Invitations() {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const jwt = auth.isAuthenticated();
    getInvitations({ t: jwt.token }).then(data => {
      if (data.error) console.error(data.error);
      else setInvites(data);
    });
  }, []);

  const handleRSVP = (eventId, response) => {
    const jwt = auth.isAuthenticated();
    respondToInvitation({ eventId, response }, { t: jwt.token }).then(data => {
      alert(data.message);
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>Event Invitations</Typography>
      <List>
        {invites.map(invite => (
          <ListItem key={invite._id}>
            <ListItemText
              primary={invite.eventId.title}
              secondary={`Status: ${invite.status}`}
            />
            <Button onClick={() => handleRSVP(invite.eventId._id, 'Accepted')}>Accept</Button>
            <Button onClick={() => handleRSVP(invite.eventId._id, 'Declined')}>Decline</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}