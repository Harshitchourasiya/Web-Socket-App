"use strict";
const mongoose = require('mongoose');
const config = require('./index');

console.log("Mongo Db connection URL is :", config.db.connectionUrl)

/** Connnecting Mongo db instance using Connection url.  */
mongoose.connect(config.db.connectionUrl, {
    useNewUrlParser: true, // If true, you must have to pass port in connection url.
    useUnifiedTopology: true, // Set true to maintain a stable connection with mongo db.
    useCreateIndex: true,
    useFindAndModify: false,
});

/** When Mongo db instance is connected successfully. */
mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully');
    process.on('SIGINT', function () {
        mongoose.disconnect();
        process.exit();
    })
});

/** When db instance get disconnected due to any cause and reconnected after a while. */
mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected');
    process.on('SIGINT', function () {
        mongoose.disconnect();
        process.exit();
    })
});

/** When there is an error while establishing connection db instance. */
mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error)
    mongoose.disconnect()
});

/** When db instance get disconnected. */
mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected');
});