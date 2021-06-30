const express = require('express');

const router = express.Router();
const auth = require('../../_middlewares/auth');
const userController = require('../controllers/user');

// routes
router.post('/signup', userController.userValidateSchema, userController.register);
router.post('/login', userController.userValidateSchema, userController.login);
router.get('/', auth.authenticate, userController.getAllOrFilterByUsername);
router.get('/:id', auth.authenticate, userController.getUserById);
router.put('/:id', auth.authenticate, userController.userValidateSchema, userController.updateUser);
router.delete('/:id', auth.authenticate, userController.deleteUser);

module.exports = router;
