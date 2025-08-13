const Post = require("../models/posts.model");
const User = require("../models/users.model");
const Comment = require("../models/comments.model");

class PostsDao {
  async createPost(req, res, next) {
    try {
      const { title, content, tags, image, author } = req.body;

      if (!title || !content || !author) {
        return res.json({
          success: false,
          message: "Title, content, and author are required",
        });
      }

      const newPost = new Post({ title, content, tags, image, author });

      const savedPost = await newPost.save();

      return res.status(200).json({
        success: true,
        data: savedPost,
        message: "Post created successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

  async getAllPosts(req, res, next) {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 20;
        let skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();

        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName");

        const postIds = posts.map(post => post._id);

        const comments = await Comment.find({ post: { $in: postIds }, active: true })
        .populate('author', 'firstName lastName')
        .sort({ createdAt: 1 });

        const commentsByPostId = comments.reduce((acc, comment) => {
        acc[comment.post] = acc[comment.post] || [];
        acc[comment.post].push({
            _id: comment._id,
            content: comment.content,
            author: comment.author
            ? {
                _id: comment.author._id,
                firstName: comment.author.firstName,
                lastName: comment.author.lastName,
                }
            : null,
            createdAt: comment.createdAt,
        });
        return acc;
        }, {});

        const formattedPosts = posts.map(post => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        image: post.image,
        author: post.author
            ? {
                _id: post.author._id,
                firstName: post.author.firstName,
                lastName: post.author.lastName,
            }
            : null,
        comments: commentsByPostId[post._id] || [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        }));

        res.status(200).json({
        success: true,
        data: formattedPosts,
        meta: {
            total: totalPosts,
            page,
            limit,
            totalPages: Math.ceil(totalPosts / limit),
        },
        });
    } catch (error) {
        return next(error);
    }
  };

  async deletePost(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);
      if (!post) {
        return res.json({ success: false, message: 'Post not found' });
      }

      await Promise.all([
        Comment.deleteMany({ post: postId }),
        Post.findByIdAndDelete(postId)
      ]);

      return res.status(200).json({
        success: true,
        message: 'Post and associated comments deleted successfully'
      });

    } catch (error) {
      return next(error);
    }
  };

}

module.exports = PostsDao;
