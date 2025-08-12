const Role = require('../models/roles.model');

class RolesDao {
  async getAllRoles(req, res, next) {
    try {
      const roles = await Role.find({ active: true }).exec();
      res.status(200).json({ success: true, data: roles });
    } catch (err) {
      next(err);
    }
  };

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
  };

  async updateRole(req, res, next) {
    try {
      const userId = req.params.id;
      const { roleType } = req.body;

      if (!roleType) {
        return res.status(400).json({ success: false, message: 'Role type is required.' });
      }

      const role = await Role.findOne({ roleType: roleType.trim(), active: true });
      if (!role) {
        return res.json({ success: false, message: `Role "${roleType}" not found or inactive.` });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: role._id },
        { new: true }
      ).populate('role', 'roleType');

      if (!updatedUser) {
        return res.json({ success: false, message: 'User not found.' });
      }

      const userResponse = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role.roleType,
        active: updatedUser.active,
      };

      return res.status(200).json({ success: true, data: userResponse });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = RolesDao;
