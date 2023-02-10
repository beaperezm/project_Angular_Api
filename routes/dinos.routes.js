const express = require ('express');
const Dino = require('../models/Dinos.js');
const createError = require('../utils/errors/create-error.js');
const isAuthPassport = require('../utils/middlewares/auth.middleware.js');
const upload = require('../utils/middlewares/file.middleware.js');
const fs= require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js')

const dinosRouter = express.Router();

dinosRouter.get('/', async (request, response, next) => {
    try {
        const allDinos = await Dino.find();
        return response.status(200).json(allDinos);
    } catch (error) {
        next(error)
    }
});

dinosRouter.get('/paged', async (request, response, next) => {
    try {
        let page = request.query.page;
        const startPage = (page - 1) * 3;
        const endPage = page * 3;
        const allDinos = await Dino.find({}, { createdAt: 0, updatedAt: 0, __v: 0 }).sort({ year: 1 });
        if (allDinos.length === 0) {
            return next(createError('No hay series disponibles', 404))
        }
        if (!page) {
            return next(createError('No se ha indicado un número de página valido', 404))
        }
        page = parseInt(page, 10);
        const pagedSeries = allDinos.slice(0, 3);
        const maxPage = Math.ceil(allDinos.length / 3);
        if (page <= 0 || (page - 1) * 3 > allDinos.length - 1) {
            return response.status(404).json(`La página no existe, la primera página es: 1 y la ultima pagina es : ${maxPage}`);
        }
        response.status(200).json({
            dinos: allDinos.slice(startPage, endPage),
            nextPage: page + 1 <= maxPage ? page + 1 : null,
            previousPage: page - 1 < 1 ? null : page - 1
        });
    } catch (error) {
        next(error)
    }
});

dinosRouter.get('/name/:name', async (request, response, next) => {
    try {
        const nameDino = request.params.name;
        const dino = await Dino.find({ name: nameDino });
        if (dino.length === 0) {
            return next(createError(`No hay ningún dinosaurio con ese nombre: ${nameDino}`, 404))
        }
        return response.status(200).json(dino);
    } catch (error) {
        next(error)
    }
});

dinosRouter.post('/to-cloud', [isAuthPassport], [upload.single('picture'), uploadToCloudinary], 
async (request, response, next) => {

    try {
      const newDino = new Dino({ ...request.body, picture: request.file_url });
      const createdDino = await newDino.save();
      return response.status(201).json(createdDino);
  
    } catch (err) {
      next(err);
    }
  });

dinosRouter.put('/:id', [isAuthPassport], async (request, response, next) => {
    try {
        const id = request.params.id;
        const modifiedDino = new Dino({ ...request.body });
        modifiedDino._id = id;
        const updatedDino = await Dino.findByIdAndUpdate(
            id,
            modifiedDino,
            { new: true }
        );
        if (!updatedDino) {
            return next(createError(`No se encuentra el dinosaurio con el Id: ${id} para actualizarlo`, 404))
        }
        return response.status(201).json(updatedDino);
    } catch (error) {
        next(error)
    }
});

dinosRouter.delete('/:id', [isAuthPassport], async (request, response, next) => {
    try {
        const id = request.params.id;
       
        const deletedDino = await Dino.findByIdAndDelete(id);
        if (!deletedDino) {
            return next(createError(`No se encuentra el dinosaurio con el Id: ${id} para eliminarlo`, 404))
        } else {
            return response.status(200).json('Dinosaurio eliminado con éxito');
        }
    } catch (error) {
        next(error)
    }
});


module.exports = dinosRouter;