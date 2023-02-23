const jwt = require('jsonwebtoken');

const getJWT = (userInfo, secretKey) => {
    return jwt.sign(
        {
            id: userInfo._id,
            email: userInfo._email,
            role: userInfo.role
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "2h"
        }
    );
};

module.exports = getJWT;