import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'School' },
  subject: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  maxMarks: { type: Number, required: true, default: 100 },
  examType: { type: String, enum: ['quiz', 'midterm', 'final', 'assignment'], required: true },
  examDate: { type: Date, required: true },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// Compound index for efficient queries
gradeSchema.index({ schoolId: 1, studentId: 1, examDate: -1 });

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;
