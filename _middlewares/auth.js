const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).send('Access denied.');

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).send('Invalid token');
  }
}
module.exports = { authenticate };
