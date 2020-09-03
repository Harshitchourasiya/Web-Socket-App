const express = require('express');
//conrollers
const chatRoom = require('../controllers/chatroom.js');

const router = express.Router();

router
    .get("/", getRecentConversation  = function (req,res) {

    })
    .get("/:roomId",getConversationByRoomId  = function (req,res) {

    })
    .post("/initiate",initiate  = function (req,res) {

    })
    .post("/:roomId/message",postMessage = function (req,res) {

    })
    .put("/:roomId/mark-read",markConversationReadByRoomId = function (req,res) {

    })

module.exports = router;