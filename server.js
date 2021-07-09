const express = require('express');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
require('dotenv').config();
const errorHandler = require('./_middlewares/error-handler');
const userRouter = require('./src/routes/user');
const authRouter = require('./src/routes/auth');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./oAuth2/facebook');
require('./oAuth2/google');

// API routes
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('/', (req, res) => {
  res.send('Hello. This is home page.');
});

// Global error handler
app.use(errorHandler);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

// Start Server
app.listen(port, () => console.log(`Server listening on port ${port}`));
