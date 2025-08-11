const UsersDao = require('../dao/users.dao');
const usersInstance = new UsersDao();

module.exports = {
  addUser: (req, res, next) => usersInstance.addUser(req, res, next),
  getAllActiveUsers: (req, res, next) => usersInstance.getAllActiveUsers(req, res, next),
};
