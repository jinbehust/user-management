const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./_middlewares/error-handler');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/users', require('./src/routes/user'));

// Global error handler
app.use(errorHandler);
// Start Server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}`));
