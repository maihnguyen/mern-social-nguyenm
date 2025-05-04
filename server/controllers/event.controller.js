import Event from '../models/event.model.js';
import Invitation from '../models/invitation.model.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, invitedUsers } = req.body;

    const event = await Event.create({
      creatorId: req.auth._id,
      title,
      description,
      date,
      time,
      location,
      invitedUsers,
      attendees: []
    });

    // Create individual invitations
    await Promise.all(invitedUsers.map(userId =>
      Invitation.create({
        eventId: event._id,
        inviterId: req.auth._id,
        inviteeId: userId
      })
    ));

    res.status(201).json(event);
    } catch (err) {
        console.error('❌ Event creation error:', err);  // full stack trace
        res.status(500).json({ error: err.message });     // send useful message back
    }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('creatorId invitedUsers attendees');

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event' });
  }
};

export const getUserEvents = async (req, res) => {
    try {
      const events = await Event.find({
        $or: [
          { creatorId: req.auth._id },
          { attendees: req.auth._id }  // Only show if accepted
        ]
      });
  
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: 'Could not retrieve events' });
    }
};

export const getInvitations = async (req, res) => {
    try {
      const invites = await Invitation.find({ inviteeId: req.auth._id, status: 'Pending' })
        .populate('eventId inviterId');
  
      res.json(invites);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch invitations' });
    }
};
  
export const updateEvent = async (req, res) => {
    try {
        const updated = await Event.findOneAndUpdate(
        { _id: req.params.eventId, creatorId: req.auth._id },
        req.body,
        { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Event not found or unauthorized' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.findOneAndDelete({ _id: req.params.eventId, creatorId: req.auth._id });
        if (!deleted) return res.status(404).json({ error: 'Event not found or unauthorized' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
  

export const respondToInvitation = async (req, res) => {
    try {
      const { eventId, response } = req.body; // expected 'Accepted' or 'Declined'
      const userId = req.auth._id;
  
      // Check if the user was actually invited
      const invitation = await Invitation.findOne({
        eventId,
        inviteeId: userId
      });
  
      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }
  
      // Update the status
      invitation.status = response;
      await invitation.save();
  
      // If accepted, add user to attendees (without duplication)
      if (response === 'Accepted') {
        await Event.findByIdAndUpdate(eventId, {
          $addToSet: { attendees: userId }
        });
      }
  
      res.json({ message: `You have ${response.toLowerCase()} the invitation.` });
    } catch (err) {
      console.error('Failed to respond to invitation:', err);
      res.status(500).json({ error: 'Failed to respond to invitation' });
    }
  };
