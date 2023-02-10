const createError = require("../errors/create-error");

const isAuthPassportAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'administrador') {
        return next();
    } else {
        return next(createError('El role indicado no está autorizado.', 401));
    }
};

module.exports = isAuthPassportAdmin