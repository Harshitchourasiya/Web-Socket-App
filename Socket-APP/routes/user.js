"use strict";
const express = require('express');

//conrollers
const userController = require("../controllers/user");

const router = express.Router();

router
    .get("/", userController.onGetAllUsers)
    .get("/:userId", userController.onGetUserById)
    .delete("/:userId", userController.onDeleteUserById)

module.exports = router;