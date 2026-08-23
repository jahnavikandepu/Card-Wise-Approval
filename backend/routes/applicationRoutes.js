import express from 'express';
import {
  submitApplication,
  getApplications,
  getApplicationStatistics,
  getApplicationById,
  deleteApplication,
  clearAllApplications
} from '../controllers/applicationController.js';
import { validateApplication } from '../middleware/validatorMiddleware.js';

const router = express.Router();

// 1. Submit Application, List Applications & Clear All Applications
router.route('/')
  .post(validateApplication, submitApplication)
  .get(getApplications)
  .delete(clearAllApplications);

// 2. Application Aggregate Statistics (Placed before :applicationId)
router.get('/statistics', getApplicationStatistics);

// 3. Single Application by ID (CW-XXXX or ObjectId) & Delete Application
router.route('/:applicationId')
  .get(getApplicationById)
  .delete(deleteApplication);

export default router;
