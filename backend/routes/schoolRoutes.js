import express from 'express';
import { getSchoolInfo, createSchool, updateSchool } from '../controllers/schoolController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/accessControl.js';

const router = express.Router();

router.get('/info', authenticate, getSchoolInfo);
router.post('/', authenticate, authorizeRoles('admin', 'principal'), createSchool);
router.put('/', authenticate, authorizeRoles('admin', 'principal'), updateSchool);

export default router;
