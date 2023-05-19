const Role = require('../models/role');
const User = require('../models/user');


const validRole = async (role = '') => {
  const existRole = await Role.findOne({ role });
  if (!existRole)
    throw new Error(`Role ${role} doesn't exist in DB.`);
}

const validEmail = async (email = '') => {
  const existEmail = await User.findOne({ email });
  if (existEmail)
    throw new Error(`Email ${email} already exist.`);
}

const existUser = async (id = '') => {
  const existUser = await User.findOne({ _id: id });
  if (!existUser)
    throw new Error(`User with ID ${id} do not exist.`);
}

module.exports = {
  validEmail,
  validRole,
  existUser
}