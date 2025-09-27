import Student from '../models/Student.js';

export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, class: studentClass } = req.query;
    const query = { schoolId: req.user.schoolId, isActive: true };
    
    if (studentClass) query.class = studentClass;
    
    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });
      
    const total = await Student.countDocuments(query);
    
    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      schoolId: req.user.schoolId
    };
    
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.user.schoolId },
      req.body,
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this new function
export const getStudentIds = async (req, res) => {
  try {
    const students = await Student.find(
      { schoolId: req.user.schoolId, isActive: true },
      { _id: 1, name: 1, rollNumber: 1 }
    ).limit(5);
    
    res.json({ 
      message: "Use these IDs for testing:",
      students: students.map(s => ({
        id: s._id,
        name: s.name,
        rollNumber: s.rollNumber
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
