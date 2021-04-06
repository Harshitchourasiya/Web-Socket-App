const mongoose = require('mongoose');
const { v4, uuidv4 } = require('uuid');

var userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    type: String,
},
    {
        timestamps: true,
        collection: "users",
    });

userSchema.statics.createUser = async function (firstName, lastName, type) {
    try { 
        console.log("inside statics metjos",{ firstName, lastName, type })
        try{
            console.log("insdie try")
            const {User } = this;
            console.log(User)
            const user = this.User.create({"firstName": firstName, "lastName" :lastName, "type":type});
            // return user;
        } catch (error) {
            console.error("error while call create statics",error)
        }
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model('user', userSchema,"users");
