const User = require('../models/users.model');
const Role = require('../models/roles.model');
const bcrypt = require('bcryptjs');

class UsersDao {
  async addUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, roleType } = req.body;

      if (!firstName || !lastName || !email || !password || !roleType) {
        return res.json({ success: false, message: 'All fields are required.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: 'Email already in use.' });
      }

      const role = await Role.findOne({ roleType: roleType.trim() });
      if (!role) {
        return res.json({ success: false, message: `Role "${roleType}" not found.` });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role._id,
      });

      await newUser.save();

      const userResponse = {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: role.roleType,
        active: newUser.active,
      };

      res.status(200).json({ success: true, data: userResponse });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersDao;
