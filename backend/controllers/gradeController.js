import Grade from '../models/Grade.js';
import Student from '../models/Student.js';

export const addGrade = async (req, res) => {
  try {
    const { studentId, subject, marks, maxMarks, examType, examDate, remarks } = req.body;
    
    // Verify student belongs to user's school
    const student = await Student.findOne({ 
      _id: studentId, 
      schoolId: req.user.schoolId 
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const grade = new Grade({
      studentId,
      schoolId: req.user.schoolId,
      subject,
      marks,
      maxMarks,
      examType,
      examDate,
      remarks,
      gradedBy: req.user.userId
    });

    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGrades = async (req, res) => {
  try {
    const { studentId, subject, examType, page = 1, limit = 20 } = req.query;
    const query = { schoolId: req.user.schoolId };

    if (studentId) query.studentId = studentId;
    if (subject) query.subject = subject;
    if (examType) query.examType = examType;

    const grades = await Grade.find(query)
      .populate('studentId', 'name rollNumber class')
      .populate('gradedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ examDate: -1 });

    const total = await Grade.countDocuments(query);

    res.json({
      grades,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const grades = await Grade.find({ 
      studentId, 
      schoolId: req.user.schoolId 
    })
    .populate('gradedBy', 'name')
    .sort({ examDate: -1 });

    const summary = grades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = { total: 0, count: 0 };
      }
      acc[grade.subject].total += (grade.marks / grade.maxMarks) * 100;
      acc[grade.subject].count += 1;
      return acc;
    }, {});

    const averages = Object.keys(summary).map(subject => ({
      subject,
      average: Math.round(summary[subject].total / summary[subject].count)
    }));

    res.json({ grades, averages });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
