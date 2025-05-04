import Event from '../models/event.model.js';
import Invitation from '../models/invitation.model.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, invitedUsers } = req.body;

    const event = await Event.create({
      creatorId: req.user._id,
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
        inviterId: req.user._id,
        inviteeId: userId
      })
    ));

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
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
        { creatorId: req.user._id },
        { invitedUsers: req.user._id },
        { attendees: req.user._id }
      ]
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve events' });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { eventId, response } = req.body; // 'Accepted' or 'Declined'

    const invitation = await Invitation.findOneAndUpdate(
      { eventId, inviteeId: req.user._id },
      { status: response },
      { new: true }
    );

    if (response === 'Accepted') {
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: req.user._id }
      });
    }

    res.json({ message: `You have ${response.toLowerCase()} the invitation.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};
