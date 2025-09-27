import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin', 'principal'], default: 'teacher' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'School' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
