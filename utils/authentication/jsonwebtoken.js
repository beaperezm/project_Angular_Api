const jwt = require('jsonwebtoken');

const getJWT = (userInfo, secretKey) => {
    return jwt.sign(
        {
            id: userInfo._id,
            email: userInfo._email,
            role: userInfo.role,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "4h"
        }
    );
};

module.exports = getJWT;