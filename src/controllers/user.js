const Joi = require('joi');
const userService = require('../services/user');
const validateRequest = require('../../_middlewares/validate-request');

function signupSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    isAdmin: Joi.boolean(),
    isActive: Joi.boolean(),
    dateOfBirth: Joi.date().raw().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email(),
    dateOfBirth: Joi.date().raw(),
  });
  validateRequest(req, next, schema);
}

async function login(req, res, next) {
  try {
    const response = await userService.authenticate(req.body);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

async function getAccessToken(req, res, next) {
  try {
    const response = await userService.getAccessToken(req.body);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

async function register(req, res, next) {
  try {
    await userService.createUser(req.body);
    return res.json({ message: 'Registration successful' });
  } catch (err) {
    return next(err);
  }
}

async function getAllOrFilterByUsername(req, res, next) {
  try {
    if (!req.query.username) {
      req.query.username = '';
    }
    const { page, size, username } = req.query;
    const users = await userService.filterByUsername(page, size, username);
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const response = await userService.updateUser(req.params.id, req.body);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  signupSchema,
  loginSchema,
  updateSchema,
  login,
  register,
  getAccessToken,
  // getAllUser,
  getUserById,
  getAllOrFilterByUsername,
  updateUser,
  deleteUser,
};
