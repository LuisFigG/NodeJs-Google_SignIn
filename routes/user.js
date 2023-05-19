const { Router } = require('express');
const { check, body } = require('express-validator');

const { validateFields, validateJWT, isInRole } = require('../middlewares');
const { validEmail, validRole, existUser } = require('../helpers/db-validators');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/user');

const router = Router();

router.get('/', [
  validateJWT,
  check('from').if(check('from').exists()).isNumeric(),
  check('limit').if(check('limit').exists()).isNumeric(),
  validateFields
], getAllUsers);

router.post('/', [
  validateJWT,
  check('name', 'Name is required.').not().isEmpty(),
  check('email', 'Email invalid.').isEmail(),
  check('email').custom(validEmail),
  check('password', 'Password invalid.').isLength(6),
  check('role').custom(validRole),
  validateFields
], createUser);

router.put('/:id', [
  validateJWT,
  check('id', 'Invalid ID.').isMongoId(),
  check('id').custom(existUser),
  body('password').if(body('password').exists()).isLength(6),
  body('role').if(body('role').exists()).custom(validRole),
  validateFields
], updateUser);

router.delete('/:id', [
  validateJWT,
  isInRole('USER_ROLE', 'SALES_ROLE'),
  check('id', 'Invalid ID.').isMongoId(),
  check('id').custom(existUser),
  validateFields
], deleteUser);

module.exports = router;