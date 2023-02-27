const express = require('express');
const passport = require('passport');
const User = require('../models/Users.js');
const createError = require('../utils/errors/create-error');
const bcrypt = require('bcrypt');
const getJWT = require('../utils/authentication/jsonwebtoken');

const userRouter = express.Router();

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


userRouter.post('/login', async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(createError('El usuario no existe'), 404);
    }

    const userFirstName = await User.findOne({ firstName });
    if (!userFirstName) {
        return next(createError('El nombre no existe'), 404);
    }

    const userLasttName = await User.findOne({ lastName });
    if (!userLasttName) {
        return next(createError('El apellido no existe'), 404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return next(createError('La contraseña no es válida', 403));
    }

    user.password = null;
    const token = getJWT(user);
    return res.status(200).json({
        user,
        token
    });
});


// userRouter.post('/logout', (req, res, next) => {
//     if(req.user) {
//         req.logOut(() => {
//             req.session.destroy(() => {
//                 res.clearCookie('connect.sid');
//                 return res.status(200).json('¡Nos vemos pronto!');
//             });
//         });
//     } else {
//         return res.status(304).json('No hay usuario logueado en este momento');
//     }
// });


module.exports = userRouter;