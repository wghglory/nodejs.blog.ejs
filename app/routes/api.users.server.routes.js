/**
 * async version, SPA
 */

'use strict';

const users = require('../../app/controllers/api.users.server.controller.js');
const passport = require('passport');

module.exports = function(app) {
    app.route('/api/user/signup')
        .post(users.beforeResponse, users.signup);

    app.route('/api/user/signin')
        .post(users.beforeResponse, users.signin); // below code doesn't work in users.signin...
    // .post(passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/user/signin',
    //     failureFlash: true
    // }));

    app.get('/api/user/signout', users.signout);

};
