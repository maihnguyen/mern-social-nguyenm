import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Invitation', InvitationSchema);
