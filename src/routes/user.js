const express = require('express');

const router = express.Router();
// const auth = require('../../_middlewares/auth');
const userController = require('../controllers/user');

// routes
router.post('/register', userController.registerSchema, userController.register);
router.post('/authenticate', userController.authenticateSchema, userController.authenticate);
router.get('/', userController.getAll);
router.get('/current', userController.getCurrent);
router.get('/:id', userController.getById);
router.put('/:id', userController.updateSchema, userController.update);
router.delete('/:id', userController._delete);

module.exports = router;
