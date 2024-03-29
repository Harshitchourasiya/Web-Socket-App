const express = require('express');

//conrollers
const deleteController = require('../controllers/delete.js');

const router = express.Router();

router
    .delete("/room/:roomId",deleteController.deleteRoomById)
    .delete("/message/:messageId",deleteController.deleteMessageById)

module.exports = router;