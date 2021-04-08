"use strict";
const express = require('express');
//controllers
const user = require('../controllers/user.js');
const authenticationController = require("../controllers/authentication");
//middelwares
const { decode, encode } = require('../middlewares/jwt.js');

const router = express.Router();

router
    .post('/login',encode,authenticationController.login)
    .post('/signup',authenticationController.signUp)

module.exports = router;