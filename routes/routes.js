const express = require('express');
const router = express.Router();
const rolesControllers = require('../controllers/roles.controllers');

router.get('/getAllRoles', rolesControllers.getAllRoles);
router.post('/addRole', rolesControllers.addRole);

module.exports = router;
