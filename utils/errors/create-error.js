const createError = (msj, status) => {
    const error = new Error (msj);
    error.status = status;
    return error;
};

module.exports = createError;