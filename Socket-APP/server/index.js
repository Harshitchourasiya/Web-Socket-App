const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// consting routes
const indexRouter = require('../routes/index');
const userRouter = require("../routes/user.js");
const chatroomRouter = require("../routes/chatroom.js");
const deleteRouter = require("../routes/delete.js");

// const middlewares
const { decode } = require("../middlewares/jwt.js");

// const config
const mongo = require('../config/mongo.js');

// express app instance
const app = express();

/** Get a port from environment and stores in Express */
const port = process.env.PORT  || "3000";
app.set("port",port);

// Server properties
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:false}));

// Adding routes to chat app
app.use('/',indexRouter);
app.use("/users",userRouter);
app.use("/room",chatroomRouter);
app.use("/delete",deleteRouter);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
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