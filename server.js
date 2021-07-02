const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();
const errorHandler = require('./_middlewares/error-handler');
const userRouter = require('./src/routes/user');
const authRouter = require('./src/routes/token');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/users', userRouter);
app.use('/auth', authRouter);

// Global error handler
app.use(errorHandler);

// Start Server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}`));
