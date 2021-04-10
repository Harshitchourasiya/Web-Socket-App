"use strict";
const jwt = require('jsonwebtoken');

// Models
const userModel = require("../models/User");

const decode = function (req, res, next) {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.email = decoded.email;
        req.userType = decoded.type;
        return next();
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
}

const encode = async function (req, res, next) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email:email});
        const payload = {
            email: user.email,
            type: user.type
        };
        const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        req.authToken = authToken;
        req.refreshToken = refreshToken;
        next();
    } catch (error) {
        return res.status(400).json({ status: false, message: error.error });
    }
}

module.exports = {
    decode,
    encode
}