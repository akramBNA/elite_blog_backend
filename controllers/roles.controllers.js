const RolesDao = require('../dao/roles.dao');
const roles_instance = new RolesDao();

module.exports = {
  getAllRoles: (req, res, next) => roles_instance.getAllRoles(req, res, next),
  addRole: (req, res, next) => roles_instance.addRole(req, res, next),
  updateRole: (req, res, next) => roles_instance.updateRole(req, res, next),
};
