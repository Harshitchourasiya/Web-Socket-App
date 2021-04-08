"use strict";
const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require("dotenv").config();

/** Declaring API routes */
const indexRouter = require('../routes/index');
const userRouter = require("../routes/user.js");
const chatroomRouter = require("../routes/chatroom.js");
const deleteRouter = require("../routes/delete.js");

/** Declaring middleware routes */
const { decode, encode } = require("../middlewares/jwt.js");

/** Establishing connection to Mongodb instance config */
require('../config/mongo.js');

/** Express app instance */
const app = express();

/** Get a port from environment and stores in Express */
const port = process.env.PORT  || "3000";
app.set("port",port);

/** Server properties */
app.use(logger('dev'));
app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended:false}));

/** Adding routes to chat app */
app.use('/',indexRouter);
app.use("/users",userRouter);
app.use("/room",decode,chatroomRouter);
app.use("/delete",deleteRouter);

/** Catch 404 and forward to error handler */
app.use('*', (res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});


/** Creating a HTTP server */
const server = http.createServer(app);

/** Listen on provided port on all available interfaces */
server.listen(port);

/** Event listeners for HTTP server listening event */
server.on('listening', () => {
    console.log(`Listening on port:: http://localhost:${port}/`);
})