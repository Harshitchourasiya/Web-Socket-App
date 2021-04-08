"use strict";
const mongoose = require('mongoose');
const { v4, uuid } = require('uuidv4');

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

// userSchema.statics.createUser = async function (firstName, lastName, type) {
//     try { 
//         console.log("inside statics metjos",{ firstName, lastName, type })
//         try{
//             console.log("insdie try")
//             const {User } = this;
//             console.log(User)
//             const user = this.User.create({"firstName": firstName, "lastName" :lastName, "type":type});
//             // return user;
//         } catch (error) {
//             console.error("error while call create statics",error)
//         }
//     } catch (error) {
//         throw error;
//     }
// }

module.exports = mongoose.model("User", userSchema);
