require('dotenv').config();
const express = require('express');
const dinosRouter = require ('./routes/dinos.routes');
const connect = require ('./utils/db/connect.js');
const cors = require ('cors');
const createError = require('./utils/errors/create-error.js');
const periodRouter = require('./routes/period.routes.js');
const passport = require('passport');
const userRouter = require('./routes/user.routes.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cloudinary = require('cloudinary');

const DB_URL = process.env.DB_URL;


connect();

const PORT = process.env.PORT || 3000;

const server = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET
});

//dominios donde está desplegado el frontal
// const whitelist = ['http://localhost:3000', 'https://project-angular-api-f9ie.vercel.app', 'http://localhost:4200']
// const corsOptions = {
//   credentials: true,
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//     callback(null, true)
//   } else {
//     callback(new Error('Not allowed by Cors'))
//   }
//   }
// };
server.use(cors());
//server.use(cors(corsOptions));

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, 'public')));

require('./utils/authentication/passport.js');

server.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 120000
  },
  store: MongoStore.create({
      mongoUrl: DB_URL
  })
}));

server.use(passport.initialize());

server.use(passport.session());

server.get('/', (req, res) => {
  res.json("Bienvenidx a mi API de dinosaurios");
})

server.use('/user', userRouter);
server.use('/dinosaurs', dinosRouter);
server.use('/historicalperiod', periodRouter);
server.use('*', (req, res, next) => {
  next(createError('Esta ruta no existe', 404));
});

server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || 'Unexpected error');
});


server.listen(PORT, () => {
    console.log(`Listening in http://localhost:${PORT}`);
  });

  module.exports = server;