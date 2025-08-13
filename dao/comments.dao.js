const Post = require("../models/posts.model");
const User = require("../models/users.model");
const Comment = require("../models/comments.model");
const { getIO } = require("../socket");

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

      if (post.author._id.toString() !== userId) {
        const io = getIO();
        io.to(post.author._id.toString()).emit("new-comment", {
          type: "comment",
          postId: post._id,
          postTitle: post.title,
          comment: populatedComment,
          fromUser: { _id: user._id, firstName: user.firstName, lastName: user.lastName }
        });
      }

      return res.status(200).json({ success: true, data: populatedComment });
    } catch (error) {
      next(error);
    }
  };

  async addReply(req, res, next) {
    try {
      const { commentId, userId, content } = req.body;

      if (!commentId || !userId || !content) {
        return res.json({ success: false, message: "commentId, userId and content are required." });
      }

      const parentComment = await Comment.findById(commentId);
      if (!parentComment || !parentComment.active) {
        return res.json({ success: false, message: "Comment not found or inactive." });
      }

      const user = await User.findById(userId);
      if (!user) return res.json({ success: false, message: "User not found." });

      const newReply = new Comment({
        content: content.trim(),
        author: userId,
        post: parentComment.post,
        replyTo: parentComment._id
      });

      await newReply.save();

      parentComment.replies.push(newReply._id);
      await parentComment.save();

      const populatedComment = await Comment.findById(parentComment._id)
        .populate('author', 'firstName lastName')
        .populate({
          path: 'replies',
          populate: { path: 'author', select: 'firstName lastName' }
        });

      if (parentComment.author._id.toString() !== userId) {
        const io = getIO();
        io.to(parentComment.author._id.toString()).emit("new-comment", {
          type: "reply",
          postId: parentComment.post,
          commentId: parentComment._id,
          reply: populatedComment.replies[populatedComment.replies.length - 1],
          fromUser: { _id: user._id, firstName: user.firstName, lastName: user.lastName }
        });
      }

      return res.status(200).json({ success: true, data: populatedComment });
    } catch (error) {
      next(error);
    }
  };

}

module.exports = CommentsDao;
