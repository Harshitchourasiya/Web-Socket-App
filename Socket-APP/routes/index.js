"use strict";
const express = require('express');

// controllers
const authenticationController = require("../controllers/authentication");

//middelwares
const { encode } = require('../middlewares/jwt.js');

const router = express.Router();

router
    .post('/login',encode,authenticationController.login)
    .post('/signup',authenticationController.signUp)

module.exports = router;