import Thread from '../models/Thread.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

// Get all threads with pagination
export const getAllThreads = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const threads = await Thread.find(query)
      .populate('author', 'username avatar')
      .populate('category', 'name slug icon color')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Thread.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      threads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single thread
export const getThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username avatar bio threadsCount repliesCount')
      .populate('category', 'name slug icon')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username avatar' }
      });

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    res.status(200).json({
      success: true,
      thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create thread
export const createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const thread = await Thread.create({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id
    });

    // Update category threads count
    await Category.findByIdAndUpdate(category, { $inc: { threadsCount: 1 } });

    // Update user threads count
    await User.findByIdAndUpdate(req.user.id, { $inc: { threadsCount: 1 } });

    const populatedThread = await thread.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      thread: populatedThread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update thread
export const updateThread = async (req, res) => {
  try {
    let thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Check authorization
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thread'
      });
    }

    thread = await Thread.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username avatar');

    res.status(200).json({
      success: true,
      thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete thread
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Check authorization
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this thread'
      });
    }

    // Update category threads count
    await Category.findByIdAndUpdate(thread.category, { $inc: { threadsCount: -1 } });

    // Update user threads count
    await User.findByIdAndUpdate(thread.author, { $inc: { threadsCount: -1 } });

    await Thread.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Thread deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
