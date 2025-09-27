import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    
    console.log('Marking attendance:', { studentId, date, status, schoolId: req.user.schoolId });
    
    // Verify student belongs to user's school
    const student = await Student.findOne({ 
      _id: studentId, 
      schoolId: req.user.schoolId 
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Parse date properly
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0); // Set to start of day

    const attendance = await Attendance.findOneAndUpdate(
      { 
        studentId, 
        schoolId: req.user.schoolId, 
        date: attendanceDate 
      },
      { 
        status, 
        remarks: remarks || '', 
        markedBy: req.user.userId 
      },
      { upsert: true, new: true }
    );

    console.log('Attendance marked:', attendance);
    res.status(201).json(attendance);
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { date, studentId, page = 1, limit = 20 } = req.query;
    const query = { schoolId: req.user.schoolId };

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }
    if (studentId) query.studentId = studentId;

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNumber class')
      .populate('markedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Get attendance error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { 
      studentId, 
      schoolId: req.user.schoolId 
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 });

    const summary = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length
    };

    res.json({ attendance, summary });
  } catch (err) {
    console.error('Student attendance error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
