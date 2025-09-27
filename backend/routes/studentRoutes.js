import express from 'express';
import { 
  getStudents, 
  createStudent, 
  getStudent, 
  updateStudent,
  getStudentIds
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/accessControl.js';

const router = express.Router();

router.get('/', authenticate, getStudents);
router.get('/test-ids', authenticate, getStudentIds);
router.post('/', authenticate, authorizeRoles('admin', 'teacher'), createStudent);
router.get('/:id', authenticate, getStudent);
router.put('/:id', authenticate, authorizeRoles('admin', 'teacher'), updateStudent);

export default router;
