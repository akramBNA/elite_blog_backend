const Role = require('../models/roles.model');

class RolesDao {
  async getAllRoles(req, res, next) {
    try {
      const roles = await Role.find({ active: true }).exec();
      res.status(200).json({ success: true, data: roles });
    } catch (err) {
      next(err);
    }
  }

  async addRole(req, res, next) {
    try {
      const { roleType } = req.body;
      if (!roleType) {
        return res.status(400).json({ success: false, message: 'roleType is required' });
      }

      const existingRole = await Role.findOne({ roleType });
      if (existingRole) {
        return res.status(400).json({ success: false, message: `Role "${roleType}" already exists` });
      }

      const newRole = new Role({ roleType });
      await newRole.save();

      res.status(201).json({ success: true, data: newRole });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RolesDao;
