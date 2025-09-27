import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNumber: { type: String, required: true },
  class: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  parentContact: { type: String, required: true },
  parentEmail: { type: String, required: true },
  address: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'School' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index for school-specific roll numbers
studentSchema.index({ schoolId: 1, rollNumber: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
