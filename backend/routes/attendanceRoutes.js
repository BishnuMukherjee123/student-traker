import express from 'express';
import { 
  markAttendance, 
  getAttendance, 
  getStudentAttendance 
} from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/accessControl.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'teacher'), markAttendance);
router.get('/', authenticate, getAttendance);
router.get('/student/:studentId', authenticate, getStudentAttendance);

export default router;
