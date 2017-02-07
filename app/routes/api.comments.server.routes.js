// Invoke 'strict' JavaScript mode
'use strict';

// Define the routes module' method
module.exports = function(app) {
    // Load the 'api' controller
    var api = require('../controllers/api.comments.server.controller');

    app.route('/api/comment').get(api.beforeResponse, api.renderComments);
    app.route('/api/comment').post(api.beforeResponse, api.submitComment);

};
