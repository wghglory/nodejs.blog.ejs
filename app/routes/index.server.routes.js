// Invoke 'strict' JavaScript mode
'use strict';

// Define the routes module' method
module.exports = function(app) {
    // Load the 'index' controller
    var index = require('../controllers/index.server.controller');

    // Mount the 'index' controller's 'render' method
    app.route('/').get(index.getCategories, index.render);
    app.route('/view').get(index.getCategories, index.renderView);  //click 'read single article'
};
