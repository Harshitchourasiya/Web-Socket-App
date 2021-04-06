const express = require('express');
//utils
const makeValidation = require('@withvoid/make-validation');
//model
// let  UserModel, { USER_TYPES } = require('../models/User')
const model = require('../models/User');
//conrollers
const user = require('../controllers/user.js');

const router = express.Router();

router
    .get("/", onGetAllUsers = function (req, res) {

    })
    .post("/", onCreateUser = async function (req, res) {
        try {
            console.log("inside on create route")
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    firstName: { type: types.string },
                    lastName: { type: types.string },
                    type: { type: types.enum, options: { enum: {
                        CONSUMER: "consumer",
                        SUPPORT: "support"
                    } } }
                }
            }));
            if (!validation.success) return res.status(400).json(validation);

            const { firstName, lastName, type } = req.body;
            console.log("CODY IS ",req.body)
            let user = new model({ firstName, lastName, type })
            user.save((error,res)=> {
                if(err){
                    console.log("error is ",err);
                } else {
                    console.log("Success")
                }
            });
            // const user = await model.createUser(firstName, lastName, type);
            console.log("res pinis ",user)
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    })
    .get("/:id", onGetUserById = function (req, res) {

    })
    .delete("/:id", onDeleteUserById = function (req, res) {

    })

module.exports = router;