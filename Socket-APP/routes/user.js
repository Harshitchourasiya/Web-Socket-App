"use strict";
const express = require('express');

// Used to apply validation to make sure to send the correct data to database that you recieved from front end app.
// const makeValidation = require('@withvoid/make-validation');

//conrollers
const userController = require("../controllers/user");

const router = express.Router();

router
    .get("/", userController.onGetAllUsers)
    .get("/:userId", userController.onGetUserById)
    .delete("/:userId", userController.onDeleteUserById)

module.exports = router;