const express = require ('express');
const YourDino = require('../models/YourDinos.js');
const createError = require('../utils/errors/create-error.js');
const upload = require('../utils/middlewares/file.middleware.js');
const fs = require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js')

const yourDinosRouter = express.Router();

yourDinosRouter.get('/', async (req, res, next) => {
    try {
        const allYourDinos = await YourDino.find();
        return res.status(200).json(allYourDinos);
    } catch (error) {
        next(error)
    }
});

yourDinosRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const yourDino = await YourDino.findById(id);
        if(yourDino) {
            return res.status(200).json(yourDino);
        } else {
            next(createError("No has creado un dinosaurio con ese id", 404));
        }
    } catch (err) {
        next(err);
    }
});


yourDinosRouter.get('/paged', async (req, res, next) => {
    try {
        let page = req.query.page;
        const startPage = (page - 1) * 6;
        const endPage = page * 6;
        const allYourDinos = await YourDino.find({}, { createdAt: 0, updatedAt: 0, __v: 0 }).sort({ year: 1 });
        if (allYourDinos.length === 0) {
            return next(createError('No hay dinosaurios creados disponibles', 404))
        }
        if (!page) {
            return next(createError('Tienes que indicar un número de página válido', 404))
        }
        page = parseInt(page, 10);
        const pagedYourDinos = allYourDinos.slice(0, 6);
        const maxPage = Math.ceil(allYourDinos.length / 6);
        if (page <= 0 || (page - 1) * 6 > allYourDinos.length - 1) {
            return res.status(404).json(`La página indicada no existe, la primera página es la 1 y la ultima pagina es la ${maxPage}`);
        }
        res.status(200).json({
            dinos: allYourDinos.slice(startPage, endPage),
            nextPage: page + 1 <= maxPage ? page + 1 : null,
            previousPage: page - 1 < 1 ? null : page - 1
        });
    } catch (error) {
        next(error)
    }
});

yourDinosRouter.get('/name/:name', async (req, res, next) => {
    try {
        const nameYourDino = req.params.name;
        const yourDino = await YourDino.find({ name: nameYourDino });
        if (yourDino.length === 0) {
            return next(createError(`No hay ningún dinosaurio creado con el nombre: ${nameYourDino}`, 404))
        }
        return res.status(200).json(yourDino);
    } catch (error) {
        next(error)
    }
});

yourDinosRouter.post('/', async (req, res, next) => {
    try {
      const yourNewDino = new YourDino({ ...req.body });
      const createdYourDino = await yourNewDino.save();
      return res.status(201).json(createdYourDino);
    } catch (err) {
      next(err);
    }
  });

yourDinosRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const modifiedYourDino = new YourDino({ ...req.body });
        modifiedYourDino._id = id;
        const updatedYourDino = await YourDino.findByIdAndUpdate(
            id,
            modifiedYourDino,
            { new: true }
        );
        if (!updatedYourDino) {
            return next(createError(`No se encuentra el dinosaurio creado con el Id: ${id} para actualizarlo`, 404))
        }
        return res.status(201).json(updatedYourDino);
    } catch (error) {
        next(error)
    }
});

yourDinosRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
       
        const deletedYourDino = await YourDino.findByIdAndDelete(id);
        if (!deletedYourDino) {
            return next(createError(`No se encuentra el dinosaurio creado con el Id: ${id} para eliminarlo`, 404))
        } else {
            return res.status(200).json('Tu dinosaurio se ha eliminado con éxito');
        }
    } catch (error) {
        next(error)
    }
});

module.exports = yourDinosRouter;

