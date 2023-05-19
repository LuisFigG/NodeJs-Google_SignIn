const { response, request } = require("express")

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user || req.user.role !== 'ADMIN_ROLE')
    return res.status(403).json({
      msg: 'You do not have the necessary role to perform the action.'
    });
  next();
}

const isInRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user)
      return res.status(403).json({
        msg: 'Invalid user.'
      });

    if (!roles.includes(req.user.role))
      return res.status(403).json({
        msg: 'You do not have the necessary role to perform the action.'
      });
    next();
  }
}

module.exports = {
  isAdminRole,
  isInRole
}