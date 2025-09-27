import express from 'express';
import { 
  addGrade, 
  getGrades, 
  getStudentGrades 
} from '../controllers/gradeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/accessControl.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'teacher'), addGrade);
router.get('/', authenticate, getGrades);
router.get('/student/:studentId', authenticate, getStudentGrades);

export default router;
