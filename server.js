const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const helmet = require('helmet');
require('dotenv').config();
const errorHandler = require('./_middlewares/error-handler');
const userRouter = require('./src/routes/user');
const authRouter = require('./src/routes/auth');

const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  return res.redirect(
    307,
    `https://${req.hostname}:${app.get('secPort')}${req.url}`,
  );
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
  res.send('Hello from ssl server');
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
app.set('secPort', port + 443);

const options = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

const secureServer = https.createServer(options, app);

secureServer.listen(app.get('secPort'), () => {
  console.log('Secure server listening on port', app.get('secPort'));
});

// Start Server
app.listen(port, () => console.log(`Server listening on port ${port}`));
