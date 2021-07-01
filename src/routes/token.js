const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

// routes
router.post('/', userController.getAccessToken);

module.exports = router;
