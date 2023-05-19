const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSigIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').notEmpty(),
  validateFields
], login);

router.post('/google', [
  check('id_token', 'Token Google is required').notEmpty(),
  validateFields
], googleSigIn);

module.exports = router;