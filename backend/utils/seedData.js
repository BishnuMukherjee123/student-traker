import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import School from '../models/School.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import 'dotenv/config';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      School.deleteMany({}),
      User.deleteMany({}),
      Student.deleteMany({})
    ]);

    // Create a school
    const school = new School({
      name: "Demo High School",
      address: "123 Education Street, Learning City",
      phone: "+1-555-0123",
      email: "info@demohigh.edu",
      establishedYear: 1995
    });
    await school.save();
    console.log('School created:', school.name);

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const principal = new User({
      name: "John Principal",
      email: "principal@demohigh.edu",
      password: hashedPassword,
      role: "principal",
      schoolId: school._id
    });

    const teacher = new User({
      name: "Jane Teacher",
      email: "teacher@demohigh.edu", 
      password: hashedPassword,
      role: "teacher",
      schoolId: school._id
    });

    const admin = new User({
      name: "Bob Admin",
      email: "admin@demohigh.edu",
      password: hashedPassword,
      role: "admin", 
      schoolId: school._id
    });

    await Promise.all([principal.save(), teacher.save(), admin.save()]);
    console.log('Users created: Principal, Teacher, Admin');

    // Update school with principal
    school.principal = principal._id;
    await school.save();

    // Create students
    const students = [
      {
        name: "Alice Johnson",
        email: "alice@student.edu",
        rollNumber: "2024001",
        class: "10A",
        dateOfBirth: new Date("2008-05-15"),
        parentContact: "+1-555-1001",
        parentEmail: "alice.parent@email.com",
        address: "456 Student Lane",
        schoolId: school._id
      },
      {
        name: "Bob Smith", 
        email: "bob@student.edu",
        rollNumber: "2024002",
        class: "10A",
        dateOfBirth: new Date("2008-08-20"),
        parentContact: "+1-555-1002", 
        parentEmail: "bob.parent@email.com",
        address: "789 Learning Ave",
        schoolId: school._id
      },
      {
        name: "Carol Wilson",
        email: "carol@student.edu", 
        rollNumber: "2024003",
        class: "10B",
        dateOfBirth: new Date("2008-12-03"),
        parentContact: "+1-555-1003",
        parentEmail: "carol.parent@email.com", 
        address: "321 Study Street",
        schoolId: school._id
      }
    ];

    await Student.insertMany(students);
    console.log('Students created:', students.length);

    console.log('\n=== SEED DATA CREATED ===');
    console.log('School ID:', school._id);
    console.log('Login credentials:');
    console.log('Principal: principal@demohigh.edu / password123');
    console.log('Teacher: teacher@demohigh.edu / password123');  
    console.log('Admin: admin@demohigh.edu / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
