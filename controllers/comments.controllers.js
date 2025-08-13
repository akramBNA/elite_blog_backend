const CommentsDao = require('../dao/comments.dao');
const comments_instance = new CommentsDao();

module.exports = {
  createComment: (req, res, next) => comments_instance.createComment(req, res, next),
  addReply: (req, res, next) => comments_instance.addReply(req, res, next),
};
