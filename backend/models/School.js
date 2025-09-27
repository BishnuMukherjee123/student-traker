import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  principal: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  establishedYear: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const School = mongoose.model('School', schoolSchema);

export default School;
