const UsersDao = require('../dao/users.dao');
const usersInstance = new UsersDao();

module.exports = {
  addUser: (req, res, next) => usersInstance.addUser(req, res, next),
  getAllActiveUsers: (req, res, next) => usersInstance.getAllActiveUsers(req, res, next),
  getUserById: (req, res, next) => usersInstance.getUserById(req, res, next),
  SignUp: (req, res, next) => usersInstance.SignUp(req, res, next),
  login: (req, res, next) => usersInstance.login(req, res, next),
  refreshToken: (req, res, next) => usersInstance.refreshToken(req, res, next),
  logout: (req, res, next) => usersInstance.logout(req, res, next),
};
