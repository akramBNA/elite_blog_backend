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
  };

  async getAllActiveUsers(req, res, next) {
    try {
        const keyword = req.query.keyword ? req.query.keyword.trim() : '';
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        let filter = { active: true };
        if (keyword) {
        filter.$or = [
            { firstName: { $regex: keyword, $options: 'i' } },
            { lastName: { $regex: keyword, $options: 'i' } }
        ];
        }

        const total = await User.countDocuments(filter);

        const users = await User.find(filter).populate('role').sort({ lastName: 1, firstName: 1 }).skip(skip).limit(limit).exec();

        const usersResponse = users.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role ? user.role.roleType : null,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        return res.status(200).json({
        success: true,
        data: usersResponse,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
        });
    } catch (error) {
        next(error);
    }
  };

  async getUserById(req, res, next) {
    try {
        let params = req.params.params;
        params = params && params.length ? JSON.parse(params) : {};

        const userId = params.id || req.params.id;

        const user = await User.findById(userId).populate('role').exec();

        if (!user || !user.active) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role ? user.role.roleType : null,
                active: user.active,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
  };

}

module.exports = UsersDao;
