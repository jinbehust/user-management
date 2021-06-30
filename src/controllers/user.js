const Joi = require('joi');
const userService = require('../services/user');
const validateRequest = require('../../_middlewares/validate-request');

function loginSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

async function login(req, res, next) {
  try {
    const user = await userService.authenticate(req.body);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().raw().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

async function register(req, res, next) {
  try {
    await userService.createUser(req.body);
    return res.json({ message: 'Registration successful' });
  } catch (err) {
    return next();
  }
}

async function getAllUser(req, res, next) {
  try {
    const users = await userService.getAllUser();
    return res.json(users);
  } catch (err) {
    return next();
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next();
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    return res.json(user);
  } catch (err) {
    return next();
  }
}
function updateSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().raw().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return next();
  }
}

module.exports = {
  loginSchema,
  login,
  registerSchema,
  register,
  getAllUser,
  getUserById,
  updateUser,
  updateSchema,
  deleteUser,
};
