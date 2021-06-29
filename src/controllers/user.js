const Joi = require('joi');
const userService = require('../services/user');
const validateRequest = require('../../_middlewares/validate-request');

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

async function authenticate(req, res, next) {
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
    await userService.create(req.body);
    return res.json({ message: 'Registration successful' });
  } catch (err) {
    return next();
  }
}

async function getAll(req, res, next) {
  try {
    const users = await userService.getAll();
    return res.json(users);
  } catch (err) {
    return next();
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next();
  }
}

function getCurrent(req, res) {
  return res.json(req.user);
}

async function update(req, res, next) {
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

async function _delete(req, res, next) {
  try {
    await userService.delete(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return next();
  }
}

module.exports = {
  authenticateSchema,
  authenticate,
  registerSchema,
  register,
  getAll,
  getById,
  getCurrent,
  update,
  updateSchema,
  _delete,
};
