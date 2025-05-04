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
        { invitedUsers: req.auth._id },
        { attendees: req.auth._id }
      ]
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve events' });
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
    const { eventId, response } = req.body; // 'Accepted' or 'Declined'

    const invitation = await Invitation.findOneAndUpdate(
      { eventId, inviteeId: req.auth._id },
      { status: response },
      { new: true }
    );

    if (response === 'Accepted') {
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: req.auth._id }
      });
    }

    res.json({ message: `You have ${response.toLowerCase()} the invitation.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};
