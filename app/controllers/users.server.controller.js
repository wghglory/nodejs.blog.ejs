/**
 * sync version, page relocation every click
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
                message = err.errors[errName].message
            }
        }
    }

    return message;
};

exports.requiresLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send({
            message: 'user is not logged in'
        });
    };

    next();
};


exports.renderSignin = (req, res, next) => {
    if (!req.user) { //after passport.login(), passport will assign req.user = user
        res.render('user/signin', {
            title: 'sign-in form',
            message: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = (req, res, next) => {
    if (!req.user) {
        res.render('user/signup', {
            title: 'sign up form',
            message: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};


exports.signup = (req, res, next) => {
    if (!req.user) {
        let password = req.body.password;
        let repassword = req.body.repassword;

        if (password !== repassword) {
            req.flash('error', 'password not the same');
            return res.redirect('/user/signup');
        }

        let user = new User(req.body);
        user.provider = 'local';

        user.save((err) => {
            if (err) {
                let message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/user/signup');
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            });

        });
    } else { //user already logged in
        return res.redirect('/');
    }
};


exports.signin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/signin',
        failureFlash: true
    })(req, res, next);
};

exports.signout = (req, res) => {
    req.logout();
    return res.redirect('/user/signin');
};
