module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  facbook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callback: process.env.FACEBOOK_CALLBACK_URL,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callback: process.env.GOOGLE_CALLBACK_URL,
  },
  secret: process.env.SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};
