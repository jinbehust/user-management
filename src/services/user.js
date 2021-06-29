const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../_helpers/db');
const config = require('../../config');

// helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

async function authenticate({ username, password }) {
  const user = await db.User.scope('withHash').findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash))) { throw new Error('Username or password is incorrect'); }

  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '10h' });
  return { ...omitHash(user.get()), token };
}

async function getAll() {
  const users = await db.User.findAll();
  return users;
}

async function getById(id) {
  const user = await getUser(id);
  return user;
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw new Error(`Username "${params.username}" is already taken`);
  }

  // hash password
  if (params.password) {
    const param = params;
    param.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  await db.User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    throw new Error(`Username "${params.username}" is already taken`);
  }

  // hash password if it was entered
  if (params.password) {
    const param = params;
    param.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
