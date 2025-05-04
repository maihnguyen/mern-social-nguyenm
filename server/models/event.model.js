import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // ISO format recommended
  time: { type: String, required: true },
  location: { type: String },
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
