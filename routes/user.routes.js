const express = require('express');
const userRouter = express.Router();
const passport = require('passport');

userRouter.post('/register', (req, res, next) => {
   
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        req.logIn(
            user,
            (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(201).json(user);
            }
        );
    };
    passport.authenticate('register', done)(req);
});

userRouter.post('/login', (req, res, next) => {
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        req.logIn(
            user,
            (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json(user);
            }
        );
    };
    passport.authenticate('login', done)(req);
});

//Cuando se haga petición con passport va a permitir controlar si el user está logueado
userRouter.get('/auth', [isAuthPassport], (req, res, next) => {
    return res.status(200).json(req.user);
});


userRouter.post('/logout', (req, res, next) => {
    if(req.user) {
        req.logOut(() => {
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return res.status(200).json('¡Nos vemos pronto!');
            });
        });
    } else {
        return res.status(304).json('No hay usuario logueado en este momento');
    }
});


module.exports = userRouter;