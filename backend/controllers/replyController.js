import Reply from '../models/Reply.js';
import Thread from '../models/Thread.js';
import User from '../models/User.js';

// Get all replies for a thread
export const getThreadReplies = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const replies = await Reply.find({ thread: threadId })
      .populate('author', 'username avatar bio role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reply.countDocuments({ thread: threadId });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      replies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create reply
export const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { threadId } = req.params;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reply content'
      });
    }

    // Check if thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    const reply = await Reply.create({
      content,
      author: req.user.id,
      thread: threadId
    });

    // Update thread replies count
    await Thread.findByIdAndUpdate(threadId, { $inc: { repliesCount: 1 } });

    // Update user replies count
    await User.findByIdAndUpdate(req.user.id, { $inc: { repliesCount: 1 } });

    const populatedReply = await reply.populate('author', 'username avatar bio role');

    res.status(201).json({
      success: true,
      reply: populatedReply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update reply
export const updateReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    let reply = await Reply.findById(id);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check authorization
    if (reply.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reply'
      });
    }

    reply = await Reply.findByIdAndUpdate(
      id,
      { content, isEdited: true },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar bio role');

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete reply
export const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const reply = await Reply.findById(id);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check authorization
    if (reply.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reply'
      });
    }

    // Update thread replies count
    await Thread.findByIdAndUpdate(reply.thread, { $inc: { repliesCount: -1 } });

    // Update user replies count
    await User.findByIdAndUpdate(reply.author, { $inc: { repliesCount: -1 } });

    await Reply.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upvote reply
export const upvoteReply = async (req, res) => {
  try {
    const { id } = req.params;
    let reply = await Reply.findById(id);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check if already upvoted
    if (reply.upvotedBy.includes(req.user.id)) {
      reply.upvotedBy = reply.upvotedBy.filter(id => id.toString() !== req.user.id);
      reply.upvotes = Math.max(0, reply.upvotes - 1);
    } else {
      reply.upvotedBy.push(req.user.id);
      reply.upvotes += 1;

      // Remove from downvotes if exists
      if (reply.downvotedBy.includes(req.user.id)) {
        reply.downvotedBy = reply.downvotedBy.filter(id => id.toString() !== req.user.id);
        reply.downvotes = Math.max(0, reply.downvotes - 1);
      }
    }

    reply = await reply.save();
    await reply.populate('author', 'username avatar');

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Downvote reply
export const downvoteReply = async (req, res) => {
  try {
    const { id } = req.params;
    let reply = await Reply.findById(id);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check if already downvoted
    if (reply.downvotedBy.includes(req.user.id)) {
      reply.downvotedBy = reply.downvotedBy.filter(id => id.toString() !== req.user.id);
      reply.downvotes = Math.max(0, reply.downvotes - 1);
    } else {
      reply.downvotedBy.push(req.user.id);
      reply.downvotes += 1;

      // Remove from upvotes if exists
      if (reply.upvotedBy.includes(req.user.id)) {
        reply.upvotedBy = reply.upvotedBy.filter(id => id.toString() !== req.user.id);
        reply.upvotes = Math.max(0, reply.upvotes - 1);
      }
    }

    reply = await reply.save();
    await reply.populate('author', 'username avatar');

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
