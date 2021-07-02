const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = require('../config');
const userModel = require('../src/model/user');

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
  const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    define: {
      underscored: true,
      freezeTableName: true, // use singular table name
      timestamps: true, // do not want timestamp fields by default
    },
    timezone: '+07:00',
  });

  // init models and add them to the exported db object
  db.User = userModel(sequelize);

  // sync all models with database
  await sequelize.sync();
}

initialize();

module.exports = db;
