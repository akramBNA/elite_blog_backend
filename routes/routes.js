const express = require('express');
const router = express.Router();
const rolesControllers = require('../controllers/roles.controllers');
const usersControllers = require('../controllers/users.controllers');


// ROLES ROUTES
router.get('/roles/getAllRoles', rolesControllers.getAllRoles);
router.post('/roles/addRole', rolesControllers.addRole);

// USERS ROUTES
router.post('/users/addUser', usersControllers.addUser);
router.get('/users/getAllActiveUsers', usersControllers.getAllActiveUsers);
router.get('/users/getUserById/:params', usersControllers.getUserById);
router.post('/users/signUp', usersControllers.SignUp);
router.post('/users/login', usersControllers.login);
router.post('/users/refreshToken', usersControllers.refreshToken);
router.post('/users/logout', usersControllers.logout);

module.exports = router;
