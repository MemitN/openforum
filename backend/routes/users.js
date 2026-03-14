import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getUserThreads,
  getAllUsers,
  updateUserRole
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);
router.get('/:id/threads', getUserThreads);

// Protected routes
router.put('/profile/update', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
