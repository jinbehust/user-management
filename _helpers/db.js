const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = require('../config');

const db = {};

async function initialize() {
  // create db if it doesn't already exist
  const {
    host, port, user, password, database,
  } = config.database;
  const connection = await mysql.createConnection({
    host, port, user, password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // init models and add them to the exported db object
  db.User = require('../src/model/user')(sequelize);

  // sync all models with database
  await sequelize.sync();
}

initialize();

module.exports = db;
