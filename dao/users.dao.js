const User = require('../models/users.model');
const Role = require('../models/roles.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        filter.firstName = { $regex: '^' + keyword, $options: 'i' };
      }

      const total = await User.countDocuments(filter);

      const users = await User.find(filter).populate('role').sort({ createdAt: -1 }).skip(skip).limit(limit).exec();

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

  async getUserStats(req, res, next) {
    try {
      const filter = { active: true };

      const total_users = await User.countDocuments(filter);

      const roleCounts = await User.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: '$role' },
        {
          $group: {
            _id: '$role.roleType',
            count: { $sum: 1 }
          }
        }
      ]);

      const counts = {
        total_users,
        admin_count: 0,
        editor_count: 0,
        writer_count: 0,
        reader_count: 0,
      };

      roleCounts.forEach(rc => {
        const role = rc._id.toLowerCase();
        if (counts.hasOwnProperty(`${role}_count`)) {
          counts[`${role}_count`] = rc.count;
        }
      });

      return res.status(200).json({
        success: true,
        data: counts
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
        let params = req.params.params;
        params = params && params.length ? JSON.parse(params) : {};

        const userId = params.user_id || req.params.user_id;

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

  async SignUp(req, res, next) {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.json({ success: false, message: 'Email already registered' });
        }

        const readerRole = await Role.findOne({ roleType: 'Reader', active: true });
        if (!readerRole) {
        return res.json({ success: false, message: 'Default role Reader not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: readerRole._id,
        active: true,
        refreshTokens: []
        });

        await newUser.save();

        const accessToken = jwt.sign(
        { userId: newUser._id, role: 'Reader' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        newUser.refreshTokens = [refreshToken];
        await newUser.save();

        return res.status(200).json({
        success: true,
        message: 'User registered and logged in successfully',
        data: {
            accessToken,
            refreshToken,
            user: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: 'Reader',
            active: newUser.active,
            createdAt: newUser.createdAt,
            }
        }
        });
    } catch (error) {
        next(error);
    }
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase(), active: true }).populate('role');
      if (!user) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role.roleType },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      user.refreshTokens = user.refreshTokens ? [...user.refreshTokens, refreshToken] : [refreshToken];
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.roleType,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  async refreshToken(req, res, next) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.json({ success: false, message: 'No refresh token provided' });
    }
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.json({ success: false, message: 'Invalid refresh token' });

        const user = await User.findById(decoded.userId).populate('role');
        if (!user || !user.refreshTokens.includes(refreshToken)) {
          return res.json({ success: false, message: 'Refresh token revoked' });
        }

        const newAccessToken = jwt.sign(
          { userId: user._id, role: user.role.roleType },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res.json({ success: true, accessToken: newAccessToken });
      });
    } catch (error) {
      next(error);
    }
  };

  async logout(req, res, next) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.json({ success: false, message: 'No refresh token provided' });
    }
    try {
      const user = await User.findOne({ refreshTokens: refreshToken });
      if (!user) {
        return res.json({ success: false, message: 'Refresh token not found' });
      }

      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();

      return res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UsersDao;
