module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  secret: process.env.SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};
