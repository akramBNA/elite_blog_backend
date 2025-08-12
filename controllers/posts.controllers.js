const PostsDao = require('../dao/posts.dao');
const posts_instance = new PostsDao();

module.exports = {
  createPost: (req, res, next) => posts_instance.createPost(req, res, next),
};
