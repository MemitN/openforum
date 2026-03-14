import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tag name'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  color: {
    type: String,
    default: '#8b5cf6'
  },
  threadsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Tag', tagSchema);
