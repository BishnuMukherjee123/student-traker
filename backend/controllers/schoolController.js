import School from '../models/School.js';

export const getSchoolInfo = async (req, res) => {
  try {
    const school = await School.findById(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSchool = async (req, res) => {
  const { name, address, phone, email, establishedYear } = req.body;
  try {
    const school = new School({
      name,
      address,
      phone,
      email,
      establishedYear,
      principal: req.user.userId
    });
    
    await school.save();
    res.status(201).json(school);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.user.schoolId,
      req.body,
      { new: true }
    );
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
