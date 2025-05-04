import express from 'express';
import {
  createEvent,
  getEventById,
  getUserEvents,
  updateEvent,
  deleteEvent,
  respondToInvitation,
  getInvitations
} from '../controllers/event.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const { requireSignin } = authCtrl;
const router = express.Router();

// Event routes
router.route('/events')
  .post(requireSignin, createEvent)       // Create event
  .get(requireSignin, getUserEvents);     // List user's events

router.route('/events/:eventId')
  .get(requireSignin, getEventById)       // Get specific event
  .put(requireSignin, updateEvent)        // Update event
  .delete(requireSignin, deleteEvent);    // Delete event

// Invitation routes
router.route('/invitations')
  .get(requireSignin, getInvitations);    // List invitations for logged-in user

router.route('/events/invite/respond')
  .post(requireSignin, respondToInvitation); // Respond to invitation

export default router;
