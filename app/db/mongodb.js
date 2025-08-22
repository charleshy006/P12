const mongoose = require('mongoose');
let app = require('pomelo').app;

mongoose.set('strictQuery', false);

mongoose.connect(app.Configs.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function () {
    console.info('[Mongoose] connected to ' + app.Configs.Mongo_URI+'.');
});

mongoose.connection.on('error',function (err) {
    console.warn('[Mongoose] connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.warn('[Mongoose] disconnected'); 
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.warn('[Mongoose] connection disconnected through app termination');
        process.exit(0);
    });
});


module.exports = mongoose;

















