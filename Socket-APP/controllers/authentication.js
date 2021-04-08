"use strict";
const makeValidation = require("@withvoid/make-validation");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const userData = await userModel.findOne({ email });
        if (!userData) return res.status(404).json({
            status: false,
            message: "User is not registered. Please sign up"
        })
        if (await bcrypt.compare(password, userData.password)) {
            return res.status(200).json({
                status: true,
                message: "User logged in successfully",
                _id: userData._id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                type: userData.type,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                authToken: req.authToken,
                refreshToken: req.refreshToken
            })
        } else {
            return res.status(403).json({
                status: false,
                message: "Password is not correct. Please enter correct password."
            })
        }
    } catch (error) {
        res.json({
            status: false,
            message: "Something went wrong",
            error:error
        });
    }
};

const signUp = async function (req, res, next) {
    try {
        const requestBodyValidation = makeValidation(types => ({
            payload: req.body,
            checks: {
                email: { type: types.string, options: { empty: false } },
                password: { type: types.string, options: { empty: false } },
                firstName: { type: types.string, options: { empty: true } },
                lastName: { type: types.string, options: { empty: true } },
                type: {
                    type: types.enum, options: {
                        enum: {
                            CONSUMER: "consumer",
                            SUPPORT: "support"
                        }, options: { empty: false }
                    }
                }
            }
        }));
        if (!requestBodyValidation.success) return res.status(400).json(requestBodyValidation);


        const user = await userModel.findOne({ email: req.body.email });
        if (user) return res.status(409).json({ status: false, message: "User Already Registered." })

        const { email, password, firstName, lastName, type } = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            email: req.body.email,
            password: hashPassword,
            firstName: (req.body.firstName) ? req.body.firstName : null,
            lastName: (req.body.lastName) ? req.body.lastName : null,
            type: req.body.type
        });
        let result = await newUser.save();
        if (!result) return res.status(400).json({
            status: false,
            message: "Error in Register this user."
        })

        // Tokens with sign up is necessaary add when you need it.
        // const tokens = await generateAccessToken(req.body.email, req.body.password);
        // if (!tokens) return res.status(400).json({
        //     status: false,
        //     message: "Token generation failed."
        // })
        return res.status(200).json({
            status: true,
            message: "User Registered Successfully",
            userData: result,
            // accessToken: tokens.accessToken,
            // refreshToken: tokens.refreshToken
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "SignUp failed",
            status: false,
            error: error
        });
    }
}

module.exports = {
    signUp,
    login
}