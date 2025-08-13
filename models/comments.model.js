const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
