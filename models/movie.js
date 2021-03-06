const Joi = require('joi');
const mongoose = require('mongoose');
const {
    genreSchema
} = require('./genre');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});
const Movie = mongoose.model('Movie', movieSchema);



// FUNCTIONS
function validateMovie(genre) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId.required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(genre, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;