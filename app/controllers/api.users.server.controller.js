/**
 * async version, SPA
 */

'use strict';

const User = require('mongoose').model('User');
const passport = require('passport');

let getErrorMessage = err => {
    let message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};

/* handle general responseData */
let responseData = '';
exports.beforeResponse = (req, res, next) => {
    responseData = {
        code: 0,
        message: ''
    };

    next();
};

exports.requiresLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send({
            message: 'user is not logged in'
        });
    }

    next();
};

exports.signup = (req, res, next) => {
    if (!req.user) {
        let password = req.body.password;
        let repassword = req.body.repassword;

        if (password !== repassword) {
            responseData.message = 'password not the same';
            responseData.code = 1;
            return res.json(responseData);
        }

        let user = new User(req.body);
        user.provider = 'local';

        user.save((err) => {
            if (err) {
                responseData.code = 2;
                responseData.message = getErrorMessage(err);
                return res.json(responseData);
            }

            req.login(user, (err) => {
                if (err) {
                    responseData.code = 3;
                    responseData.message = 'register failed';
                    return res.json(responseData);
                }

                responseData.message = 'registered successfully';
                return res.json(responseData);
            });

        });
    } else { //user already logged in
        return res.redirect('/');
    }
};

exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }
        if (!user) { // fail: user false
            // console.log(err, user, info) //null false { message: 'Unknown user' }
            responseData.message = info.message;
            responseData.code = 4;
            return res.json(responseData);
        }

        // console.log(user) // user is user object! has everything
        req.login(user, (err) => {
            if (err) return next(err);
            // console.log(req.user);  // after login, req.user = user object. has everything! So in ejs, <%= user %>has value
            responseData.message = 'login successfully';
            return res.json(responseData);
        });
    })(req, res, next);
};

exports.signout = (req, res) => {
    req.logout();
    return res.redirect('/user/signin');
};
