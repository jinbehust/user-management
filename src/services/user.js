const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../../_helpers/db');
const config = require('../../config');

// helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

async function getUserHard(id) {
  const user = await db.User.findByPk(id, { paranoid: false });
  if (!user) throw new Error('User not found');
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

async function authenticate({ username, password }) {
  const user = await db.User.scope('withHash').findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash))) {
    throw new Error('Username or password is incorrect');
  }

  // authentication successful
  const accessToken = jwt.sign({ username: user.username }, config.secret, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(
    { username: user.username },
    config.refreshTokenSecret,
    { expiresIn: '24h' },
  );
  const response = {
    status: 'Logged in',
    accessToken,
    refreshToken,
  };
  return response;
}

async function getAccessToken({ username, refreshToken }) {
  if (refreshToken) {
    const user = await db.User.scope('withHash').findOne({
      where: { username },
    });

    console.log(user);
    const accessToken = jwt.sign({ username: user.username }, config.secret, {
      expiresIn: '1h',
    });
    const response = {
      accessToken,
    };
    return response;
  }
  throw new Error('Invalid request');
}

async function getUserById(id) {
  const user = await getUser(id);
  return omitHash(user.get());
}

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: userItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(userItems / limit);

  return {
    userItems,
    users,
    totalPages,
    currentPage,
  };
};

async function filterByUsername(page, size, username) {
  const condition = username
    ? { username: { [Op.like]: `%${username}%` } }
    : null;
  const { limit, offset } = getPagination(page, size);
  const data = await db.User.findAndCountAll({
    where: condition,
    limit,
    offset,
  });
  const response = getPagingData(data, page, limit);
  return response;
}

async function createUser(params) {
  // validate
  if (
    await db.User.findOne({
      where: { username: params.username },
      paranoid: false,
    })
  ) {
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

async function updateUser(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged
    && (await db.User.findOne({ where: { username: params.username } }))
  ) {
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

  return user;
}

async function deleteUser(id) {
  const user = await getUser(id);
  await user.destroy();
  return 'User deleted!';
}

async function restoreUser(id) {
  const user = await getUserHard(id);
  if (!user.dataValues.deletedAt) {
    throw new Error('User not deleted!');
  }
  await user.restore();
  return 'User restored!';
}

module.exports = {
  authenticate,
  getAccessToken,
  getUserById,
  filterByUsername,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
};
