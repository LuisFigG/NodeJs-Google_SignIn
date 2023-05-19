const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email, state: true });
    if (!userFound) {
      return res.status(400).json({
        msg: 'User not found.'
      });
    }

    const validatePassword = bcryptjs.compareSync(password, userFound.password);
    if (!validatePassword) {
      return res.status(400).json({
        msg: 'User or password incorrect.'
      });
    }

    const token = await generateJWT(userFound._id);

    res.json({
      msg: 'User logged.',
      user: userFound,
      token
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Error in server.'
    });
  }
}

const googleSigIn = async (req, res = response) => {
  const { id_token } = req.body

  console.log("Token Google:", id_token);

  try {
    const { name, picture, email } = await googleVerify(id_token);

    console.log("Name:", name, "Picture:", picture, "Email:", email);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: '0000',
        role: 'USER_ROLE',
        google: true
      }

      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'User has been deleted.'
      });
    }

    const token = await generateJWT(user._id);

    console.log("Token jwt:", token);
    
    res.json({
      msg: 'User logged from Google.',
      user,
      token
    });
  } catch (err) {
    res.status(400).json({
      msg: 'Token no verified.'
    });
  }
}

module.exports = {
  login,
  googleSigIn
}