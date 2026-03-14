import express from 'express';
import {
  createReply,
  getReplies,
  updateReply,
  deleteReply,
  upvoteReply,
  downvoteReply
} from '../controllers/replyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get replies for a thread
router.get('/:threadId', getReplies);

// Create reply
router.post('/:threadId', protect, createReply);

// Update, delete, and vote on replies
router.put('/:id', protect, updateReply);
router.delete('/:id', protect, deleteReply);
router.post('/:id/upvote', protect, upvoteReply);
router.post('/:id/downvote', protect, downvoteReply);

export default router;
