const createEvent = async (event, credentials) => {
    try {
      let response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t
        },
        body: JSON.stringify(event)
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };
  
  const listUserEvents = async (credentials) => {
    try {
      let response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + credentials.t
        }
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };
  
  const getInvitations = async (credentials) => {
    try {
      let response = await fetch('/api/invitations', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + credentials.t
        }
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };
  
  const respondToInvitation = async (body, credentials) => {
    try {
      let response = await fetch('/api/events/invite/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t
        },
        body: JSON.stringify(body)
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (eventId, credentials) => {
    try {
      let response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + credentials.t
        }
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const readEvent = async (eventId, credentials) => {
    try {
      let response = await fetch(`/api/events/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + credentials.t
        }
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };  
  
  const updateEvent = async (eventId, event, credentials) => {
    try {
      let response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(event)
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };
  
  export {
    readEvent,
    deleteEvent,
    updateEvent,
    listUserEvents,
    getInvitations,
    respondToInvitation
  };  

