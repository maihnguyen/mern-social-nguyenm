import express from 'express';
import { createEvent, getEventById, getUserEvents, respondToInvitation } from '../controllers/event.controller.js';
import authCtrl from '../controllers/auth.controller.js'; 
const { requireSignin } = authCtrl;

const router = express.Router();

router.post('/events', requireSignin, createEvent);
router.get('/events/:eventId', requireSignin, getEventById);
router.get('/events', requireSignin, getUserEvents);
router.post('/events/invite/respond', requireSignin, respondToInvitation);

export default router;
