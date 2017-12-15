// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Define the Mongoose configuration method
module.exports = function() {
    // Use Mongoose to connect to MongoDB
    var db = mongoose.connect(config.db, {
        useMongoClient: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0,
    });

    // Load the application models
    require('../app/models/user.server.model');
    require('../app/models/article.server.model');
    require('../app/models/category.server.model');

    // Return the Mongoose connection instance
    return db;
};
