const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
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

router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(404).send(`Movie with ID ${req.params.id} was not found.`);

    res.send(movie);

});

// POST REQUEST
router.post('/', [auth], async (req, res) => {
    const {
        error
    } = validate(req.body);
    // if error - Bad Request 400
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate

    });
    try {
        await movie.save();
        res.send(movie);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


// PUT REQUEST
router.put('/:id', [auth, validateObjectId], async (req, res) => {

    // if bad request
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return status(400).send('Invalid genre.', err);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
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
    if (!movie) return express.status(404).send('The movie with the given ID was not found!');

    res.send(movie);


});


// DELETE REQUEST
router.delete('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(`Movies with ID ${req.params.id} was not found`);

    res.send(movie);
});


module.exports = router;