"use strict";
const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

var userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuid().replace(/\-/g, ""),
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true },
    firstName: { type: String },
    lastName: { type: String }
}, {
    timestamps: true,
    collection: "users",
});

module.exports = mongoose.model("User", userSchema);
