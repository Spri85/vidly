const express = require('express');
const router = express.Router();
const {
    Genre,
    validate
} = require('../models/genre')
// GET REQUEST
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} was not found.`);
    res.send(genre);
});

// POST REQUEST
router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    // if error - Bad Request 400
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
    try {
        genre = await genre.save();
        res.send(genre);
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

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    });

    if (!genre) return express.status(404).send('The genre with the given ID was not found!');

    res.send(genre);
});


// DELETE REQUEST
router.delete('/:id', async (req, res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} was not found`);

    // Delete genre
    res.send(genre);
});


module.exports = router;