const express = require('express');
const Period = require('../models/Period.js');
const createError = require('../utils/errors/create-error.js');
const isAuthPassportAdmin = require("../utils/middlewares/auth.middleware.js");
const upload = require('../utils/middlewares/file.middleware.js');
const fs = require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

const periodRouter = express.Router();

periodRouter.get('/', async (req, res, next) => {
    try {
        const period = await Period.find().populate('dinosaur');
        return res.status(200).json(period);
    } catch (err) {
        next(err); 
    }
});

periodRouter.get("/paginated-period", async (req, res, next) => {
    try {
      const currentPage = req.query.page;
      if(!currentPage) {
        next(createError("Tienes que indicar un número de página válido", 404))
      }
      /* 1 --> 0 - 4
         2 --> 5 - 8
         3 --> 9 - 12
         n --> start = (n-1)*4 - end = n*4 */
      const findPeriod = await Period.find();
      const start = (currentPage - 1) * 4;
      const end = currentPage * 4;
      //with .slice we return a copy with start and end defined previously
      const period = findPeriod.slice(start, end);
      if(currentPage <= 0 || start > findPeriod.length - 1 ) {
        next(createError(`La página indicada no existe, la primera página es la 1 y la última es la ${Math.ceil(findPeriod.length / 4)}`, 404));
      }
      return res.status(200).json(period);
    } catch (err) {
      next(err);
    }
  });


periodRouter.post('/', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        const newPeriod = new Period({ ...req.body });
        const createdPeriod = await newPeriod.save();
        return res.status(201).json(createdPeriod);
    } catch (err) {
        next(err); 
    }
});


periodRouter.put('/add-period', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        const { periodId, dinoId } = req.body;
        if(!periodId) {
           return next(createError('Se necesita un id de período histórico'));
        }
        if(!dinoId) {
            return next(createError('Se necesita un id de dinosaurio para poder añadirlo'));
        }
        const periodUpdated = await Period.findByIdAndUpdate(
            periodId,
            { $push: { dinos: dinoId }},
            { new: true }
        );
        return res.status(200).json(periodUpdated);
    } catch (err) {
        next(err);  
    }
});


periodRouter.delete('/:id', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        const id = req.params.id;
        await Period.findByIdAndDelete(id);
        return res.status(200).json('El período histórico ha sido eliminado correctamente');
    } catch (err) {
        next(err);  
    }
});


module.exports = periodRouter;