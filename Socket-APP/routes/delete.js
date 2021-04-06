const express = require('express');
//conrollers
const deleteUser = require('../controllers/delete.js');

const router = express.Router();

router
    .delete("/room/:roomId",deleteRoomById = function (req,res) {

    })
    .delete("/message/:messageId",deleteMessageById = function (req,res) {

    })

module.exports = router;