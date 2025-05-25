const express = require('express');
const router = express.Router();

const { registerUser } = require('../Controllers/user');
const { loginUser } = require('../Controllers/user');
const { validateUserRegister, validateUserLogin } = require('../Middlewares/PreDataValidation');

router.post('/register', validateUserRegister, registerUser);

router.post('/login',validateUserLogin, loginUser);

module.exports = router;