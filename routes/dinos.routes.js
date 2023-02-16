const express = require ('express');
const Dino = require('../models/Dinos.js');
const createError = require('../utils/errors/create-error.js');
const isAuthPassport = require('../utils/middlewares/auth.middleware.js');
const upload = require('../utils/middlewares/file.middleware.js');
const fs = require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js')

const dinosRouter = express.Router();

dinosRouter.get('/', async (req, res, next) => {
    try {
        const allDinos = await Dino.find();
        return res.status(200).json(allDinos);
    } catch (error) {
        next(error)
    }
});

dinosRouter.get('/detail/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const dino = await Dino.findById(id);
        if(dino) {
            return res.status(200).json(dino);
        } else {
            next(createError("No existe un dinosaurio con ese id", 404));
        }
    } catch (err) {
        next(err);
    }
});

dinosRouter.get('/paged', async (req, res, next) => {
    try {
        let page = req.query.page;
        const startPage = (page - 1) * 9;
        const endPage = page * 9;
        const allDinos = await Dino.find({}, { createdAt: 0, updatedAt: 0, __v: 0 }).sort({ year: 1 });
        if (allDinos.length === 0) {
            return next(createError('No hay dinosaurios disponibles', 404))
        }
        if (!page) {
            return next(createError('Tienes que indicar un número de página válido', 404))
        }
        page = parseInt(page, 10);
        const pagedSeries = allDinos.slice(0, 9);
        const maxPage = Math.ceil(allDinos.length / 9);
        if (page <= 0 || (page - 1) * 9 > allDinos.length - 1) {
            return res.status(404).json(`La página indicada no existe, la primera página es la 1 y la ultima pagina es la ${maxPage}`);
        }
        res.status(200).json({
            dinos: allDinos.slice(startPage, endPage),
            nextPage: page + 1 <= maxPage ? page + 1 : null,
            previousPage: page - 1 < 1 ? null : page - 1
        });
    } catch (error) {
        next(error)
    }
});

dinosRouter.get('/name/:name', async (req, res, next) => {
    try {
        const nameDino = req.params.name;
        const dino = await Dino.find({ name: nameDino });
        if (dino.length === 0) {
            return next(createError(`No hay ningún dinosaurio con ese nombre: ${nameDino}`, 404))
        }
        return res.status(200).json(dino);
    } catch (error) {
        next(error)
    }
});

dinosRouter.post('/to-cloud', [upload.single('picture'), uploadToCloudinary], 
async (req, res, next) => {

    try {
      const newDino = new Dino({ ...req.body, picture: req.file_url });
      const createdDino = await newDino.save();
      return res.status(201).json(createdDino);
  
    } catch (err) {
      next(err);
    }
  });

dinosRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const modifiedDino = new Dino({ ...req.body });
        modifiedDino._id = id;
        const updatedDino = await Dino.findByIdAndUpdate(
            id,
            modifiedDino,
            { new: true }
        );
        if (!updatedDino) {
            return next(createError(`No se encuentra el dinosaurio con el Id: ${id} para actualizarlo`, 404))
        }
        return res.status(201).json(updatedDino);
    } catch (error) {
        next(error)
    }
});

dinosRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
       
        const deletedDino = await Dino.findByIdAndDelete(id);
        if (!deletedDino) {
            return next(createError(`No se encuentra el dinosaurio con el Id: ${id} para eliminarlo`, 404))
        } else {
            return res.status(200).json('Dinosaurio eliminado con éxito');
        }
    } catch (error) {
        next(error)
    }
});


module.exports = dinosRouter;