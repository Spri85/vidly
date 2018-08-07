const express = require('express');
const router = express.Router();

let genres = [{
        id: 1,
        name: 'action'
    },
    {
        id: 2,
        name: 'adventure'
    },
    {
        id: 3,
        name: 'comedy'
    },
    {
        id: 4,
        name: 'crime and ganster'
    },
    {
        id: 5,
        name: 'drama'
    },
    {
        id: 6,
        name: 'epics / historical'
    },
    {
        id: 7,
        name: 'horror'
    },
    {
        id: 8,
        name: 'musical / dance'
    },
    {
        id: 9,
        name: 'science / fiction'
    },
    {
        id: 10,
        name: 'war'
    },
    {
        id: 11,
        name: 'westerns'
    },
]


// GET REQUEST
router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} was not found.`);
    res.send(genre);
});

// POST REQUEST
router.post('/', (req, res) => {
    const {
        error
    } = validateGenre(req.body);
    // if error - Bad Request 400
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: createGenreId(),
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});


// PUT REQUEST
router.put('/:id', (req, res) => {
    // Look up genre
    const genre = genres.find(g => g.id = parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} was not found`);

    // if bad request
    const {
        error
    } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update genre
    genre.name = req.body.name;
    res.send(genre);
});


// DELETE REQUEST
router.delete('/:id', (req, res) => {
    // Look up genre
    const genre = genres.find(g => g.id = parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} was not found`);

    // Delete genre
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});


// FUNCTIONS
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).max(255).required()
    };
    return Joi.validate(genre, schema);
}

function createGenreId() {
    return genres[genres.length - 1].id + 1;
}

module.exports = router;