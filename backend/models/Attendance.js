import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'School' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// Compound index for efficient queries
attendanceSchema.index({ schoolId: 1, date: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
