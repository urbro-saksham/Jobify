const express = require('express');
const { registerRecruiter } = require('../Controllers/recruiter');
const { loginRecruiter } = require('../Controllers/recruiter');
const { validateRecruiterRegister, validateRecruiterLogin } = require('../Middlewares/PreDataValidation');

const router = express.Router();

router.post('/register',validateRecruiterRegister, registerRecruiter);

router.post('/login',validateRecruiterLogin, loginRecruiter);

module.exports = router;