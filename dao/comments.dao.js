const Post = require("../models/posts.model");
const User = require("../models/users.model");
const Comment = require("../models/comments.model");

class CommentsDao {
  async createComment(req, res, next) {
    try {
      const { postId, userId, content } = req.body;

      if (!postId || !userId || !content) {
        return res.json({ success: false, message: "postId, userId and content are required." });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.json({ success: false, message: "Post not found." });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.json({ success: false, message: "User not found." });
      }

      const newComment = new Comment({
        content: content.trim(),
        author: userId,
        post: postId
      });

      await newComment.save();

      const populatedComment = await Comment.findById(newComment._id).populate('author', 'firstName lastName email');

      return res.status(200).json({ success: true, data: populatedComment });
    } catch (error) {
      next(error);
    }
  };

  async addReply(req, res, next) {
    try {
      const { commentId, userId, content } = req.body;

      if (!commentId || !userId || !content) {
        return res.json({ success: false, message: "commentId, userId, and content are required." });
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.json({ success: false, message: "Comment not found." });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.json({ success: false, message: "User not found." });
      }

      const newReply = {
        content: content.trim(),
        author: userId
      };

      comment.replies.push(newReply);
      await comment.save();

      const updatedComment = await Comment.findById(commentId)
        .populate('author', 'firstName lastName')
        .populate('replies.author', 'firstName lastName');

      return res.status(200).json({ success: true, data: updatedComment });
    } catch (error) {
      next(error);
    }
  };

}

module.exports = CommentsDao;
