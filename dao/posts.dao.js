const Post = require('../models/posts.model');
const User = require('../models/users.model');

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
  }
}

module.exports = PostsDao;
