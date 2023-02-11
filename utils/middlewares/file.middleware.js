const multer = require("multer");
const path = require("path");
const createError = require("../errors/create-error");
const VALID_FILE_TYPES = ['image/png', 'image/tga'];

const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(createError("El archivo no tiene un formato válido (se acepta png y tga con alpha)"));
    } else {
        cb(null, true);
    }
};

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
    destination: (req, file, cb) => {
        cb(null, '/tmp/');
    }
});

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;

