"use strict";
const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

var chatRoomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuid().replace(/\-/g, ""),
    },
    userIds: {
        type: Array
    },
    type: {
        type: String
    },
    chatInitiator: {
        type: String
    }
}, {
    timestamps: true,
    collection: "chatrooms",
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);