const Post = require("../models/posts.model");
const User = require("../models/users.model");

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
      const posts = await Post.find().populate("author", "firstName lastName").sort({ createdAt: -1 });

      const formattedPosts = posts.map((post) => ({
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
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));

      res.status(200).json({
        success: true,
        data: formattedPosts,
      });

    } catch (error) {
      return next(error);
    }
  };
}

module.exports = PostsDao;
