const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('X-Token');

  if (!token) {
    return res.status(401).json({
      msg: 'Token not provided within the request.'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);
    const user = await User.findById(uid);
    if (!user || !user.state) {
      return res.status(401).json({
        msg: 'Invalid user.'
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      msg: 'Failed to verify token.'
    });
  }
}

module.exports = {
  validateJWT
}