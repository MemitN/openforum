import express from 'express';
import {
  getThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  pinThread,
  getForumStats
} from '../controllers/threadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getThreads);
router.get('/stats', getForumStats);
router.get('/:id', getThreadById);

// Protected routes
router.post('/', protect, createThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);
router.patch('/:id/pin', protect, authorize('admin', 'moderator'), pinThread);

export default router;
