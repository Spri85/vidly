const express = require('express');
const Joi = require('joi');

const router = express.Router();
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customerSchema);

// GET REQUEST
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} was not found.`);
    res.send(customer);
});

// POST REQUEST
router.post('/', async (req, res) => {
    const {
        error
    } = validateCustomer(req.body);
    // if error - Bad Request 400
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    try {
        customer = await customer.save();
        res.send(customer);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


// PUT REQUEST
router.put('/:id', async (req, res) => {

    // if bad request
    const {
        error
    } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {
        new: true
    });

    if (!customer) return express.status(404).send('The customer with the given ID was not found!');

    res.send(customer);
});


// DELETE REQUEST
router.delete('/:id', async (req, res) => {

    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} was not found`);

    // Delete customer
    res.send(customer);
});


// FUNCTIONS
function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports = router;