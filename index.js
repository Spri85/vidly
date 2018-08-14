require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();


winston.handleExceptions(new winston.transports.File({
    filename: 'uncaughtException.log'
}));

process.on('unhandledRejection', (ex) => {
    throw ex;

});

winston.add(winston.transports.File, {
    filename: 'logfile.log'
});
winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vildy'
});

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.');
    process.exit(1);
}

mongoose
    .connect('mongodb://localhost/vildy')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3500;
app.listen(port, console.log(`Listening port ${port}`));