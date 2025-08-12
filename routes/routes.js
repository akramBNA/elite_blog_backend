const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authentication.middlewares');
const rolesControllers = require('../controllers/roles.controllers');
const usersControllers = require('../controllers/users.controllers');


// ROLES ROUTES
router.get('/roles/getAllRoles', authenticateToken, rolesControllers.getAllRoles);
router.post('/roles/addRole', authenticateToken, rolesControllers.addRole);
router.put('/roles/updateRole/:id', authenticateToken, rolesControllers.updateRole)

// USERS ROUTES
router.post('/users/addUser', usersControllers.addUser);
router.get('/users/getAllActiveUsers', authenticateToken, usersControllers.getAllActiveUsers);
router.get('/users/getUserStats', authenticateToken, usersControllers.getUserStats);
router.get('/users/getUserById/:params', authenticateToken, usersControllers.getUserById);
router.post('/users/signUp', usersControllers.SignUp);
router.post('/users/login', usersControllers.login);
router.post('/users/refreshToken', usersControllers.refreshToken);
router.post('/users/logout', authenticateToken, usersControllers.logout);

module.exports = router;
