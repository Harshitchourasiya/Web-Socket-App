"use strict";
const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

var readByRecipientSchema = new mongoose.Schema({
    _id: false,
    readByUserId: { type: String },
    readAt: {
        type: Date,
        default: Date.now(),
    },
},
    {
        timestamps: false,
    });

const chatMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid().replace(/\-/g, ""),
        },
        chatRoomId: { type: String },
        message: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            default: () => "text",
        },
        postedByUser: { type: String },
        readByRecipients: [readByRecipientSchema],
    },
    {
        timestamps: true,
        collection: "chatmessages",
    }
);
module.exports = mongoose.model("chatMessages", chatMessageSchema);