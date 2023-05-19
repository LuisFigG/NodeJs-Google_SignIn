const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getAllUsers = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments({ state: true }),
    User.find({ state: true })
      .skip(Number(from))
      .limit(Number(limit))
  ]);

  res.json({
    total,
    users
  });
}

const createUser = async (req, res = response) => {
  const { name, email, password, role } = req.body;

  const user = new User({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json({
    ok: true,
    msg: 'User created succesfully.',
    user
  });
}

const updateUser = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...data } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, data);

  res.json({
    ok: true,
    msg: 'User updated successfully.',
    user
  });
}

const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    ok: true,
    msg: 'User deleted successfully',
    user
  });
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}