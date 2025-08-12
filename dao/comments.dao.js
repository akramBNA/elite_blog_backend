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
}

module.exports = CommentsDao;
