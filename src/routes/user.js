const express = require('express');

const router = express.Router();
// const auth = require('../../_middlewares/auth');
const userController = require('../controllers/user');

// routes
router.post('/signup', userController.loginSchema, userController.register);
router.post('/login', userController.loginSchema, userController.login);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateSchema, userController.updateSchema);
router.delete('/:id', userController.deleteUser);

module.exports = router;
