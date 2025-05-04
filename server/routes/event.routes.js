import express from 'express';
import { createEvent, getEventById, getUserEvents, respondToInvitation, updateEvent, deleteEvent} from '../controllers/event.controller.js';
import authCtrl from '../controllers/auth.controller.js'; 
const { requireSignin } = authCtrl;

const router = express.Router();

router.post('/events', requireSignin, createEvent);
router.get('/events/:eventId', requireSignin, getEventById);
router.put('/events/:eventId', requireSignin, updateEvent);
router.delete('/events/:eventId', requireSignin, deleteEvent);
router.get('/events', requireSignin, getUserEvents);
router.post('/events/invite/respond', requireSignin, respondToInvitation);

export default router;
