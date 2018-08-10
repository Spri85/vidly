const express = require('express');
const router = express.Router();
const {
    Movie,
    validate
} = require('../models/movie');
const {
    Genre
} = require('../models/genre')

// GET REQUEST
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {

    try {
        const movie = await Movie.findById(req.params.id);
        res.send(movie);
    } catch (err) {
        res.status(404).send(`Movie with ID ${req.params.id} was not found.`);
    }
});

// POST REQUEST
router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    // if error - Bad Request 400
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
    } catch (err) {
        return status(400).send('Invalid genre.');
    }

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate

    });
    try {
        movie = await movie.save();
        res.send(movie);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


// PUT REQUEST
router.put('/:id', async (req, res) => {

    // if bad request
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
    } catch (err) {
        return status(400).send('Invalid genre.', err);
    }

    try {
        let movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate

        }, {
            new: true
        });
        res.send(movie);
    } catch (err) {
        return express.status(404).send('The movie with the given ID was not found!');
    }
});


// DELETE REQUEST
router.delete('/:id', async (req, res) => {

    try {
        const movies = await Movie.findByIdAndRemove(req.params.id);
        // Delete movies
        res.send(movies);
    } catch (err) {
        return res.status(404).send(`Movies with ID ${req.params.id} was not found`);
    }
});


module.exports = router;