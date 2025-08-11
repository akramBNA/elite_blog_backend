const express = require('express');
const router = express.Router();
const rolesControllers = require('../controllers/roles.controllers');

router.get('/roles/getAllRoles', rolesControllers.getAllRoles);
router.post('/roles/addRole', rolesControllers.addRole);

module.exports = router;
