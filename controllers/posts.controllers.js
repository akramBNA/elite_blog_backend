const PostsDao = require('../dao/posts.dao');
const posts_instance = new PostsDao();

module.exports = {
  createPost: (req, res, next) => posts_instance.createPost(req, res, next),
  getAllPosts: (req, res, next) => posts_instance.getAllPosts(req, res, next),
  deletePost: (req, res, next) => posts_instance.deletePost(req, res, next),
  updatePost: (req, res, next) => posts_instance.updatePost(req, res, next),
};
