/**
 * sync version, page relocation every click
 */

'use strict';

const users = require('../../app/controllers/users.server.controller.js');
const passport = require('passport');

module.exports = function(app) {
    app.route('/user/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/user/signin')
        .get(users.renderSignin)
        // .post(passport.authenticate('local', {
        //     successRedirect: '/',
        //     failureRedirect: '/user/signin',
        //     failureFlash: true
        // }));
        .post(users.signin);

    app.get('/user/signout', users.signout);

};
