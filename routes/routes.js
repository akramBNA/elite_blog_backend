const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authentication.middlewares');
const authorizeRole = require("../middlewares/authorizeRole");
const rolesControllers = require('../controllers/roles.controllers');
const usersControllers = require('../controllers/users.controllers');
const postsControllers = require('../controllers/posts.controllers');
const commentsControllers = require('../controllers/comments.controllers');


// ROLES ROUTES
router.get('/roles/getAllRoles', authenticateToken, authorizeRole('Admin'), rolesControllers.getAllRoles);
router.post('/roles/addRole', authenticateToken, authorizeRole('Admin'), rolesControllers.addRole);
router.put('/roles/updateRole/:id', authenticateToken, authorizeRole('Admin'), rolesControllers.updateRole)

// USERS ROUTES
router.post('/users/addUser', usersControllers.addUser);
router.get('/users/getAllActiveUsers', authenticateToken, authorizeRole('Admin'), usersControllers.getAllActiveUsers);
router.get('/users/getUserStats', authenticateToken, authorizeRole('Admin'), usersControllers.getUserStats);
router.get('/users/getUserById/:params', authenticateToken, authorizeRole('Admin'), usersControllers.getUserById);
router.post('/users/signUp', usersControllers.SignUp);
router.post('/users/login', usersControllers.login);
router.post('/users/refreshToken', usersControllers.refreshToken);
router.post('/users/logout', authenticateToken, usersControllers.logout);

// POSTS ROUTES
router.post('/posts/createPost', authenticateToken, authorizeRole('Admin', 'Editor', 'Writer'), postsControllers.createPost);
router.get('/posts/getAllPosts', authenticateToken, postsControllers.getAllPosts);
router.put('/posts/deletePost/:id', authenticateToken, authorizeRole('Admin'), postsControllers.deletePost);
router.put('/posts/updatePost/:id', authenticateToken, authorizeRole('Admin', 'Editor', 'Writer'), postsControllers.updatePost);


// COMMENTS ROUTES
router.post('/comments/createComment', authenticateToken, commentsControllers.createComment);
router.post('/comments/addReply', authenticateToken, commentsControllers.addReply);

module.exports = router;
