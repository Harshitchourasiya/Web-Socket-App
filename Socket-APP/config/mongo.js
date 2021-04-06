const mongoose = require('mongoose');
const config = require('./index');

console.log("Mongo Db connection URL is :",config.db.connectionUrl)
mongoose.connect(config.db.connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully');
    process.on('SIGINT', function () {
        mongoose.disconnect();
        process.exit();
    })
});

mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected')
});

mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error)
    mongoose.disconnect()
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected')
});