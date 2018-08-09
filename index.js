const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const app = express();

mongoose
    .connect('mongodb://localhost/vildy')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));


app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3500;
app.listen(port, console.log(`Listening port ${port}`));