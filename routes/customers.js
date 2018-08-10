const express = require('express');
const {
    Customer,
    validate
} = require('../models/customer');

const router = express.Router();

// GET REQUEST
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {

    try {
        const customer = await Customer.findById(req.params.id);
        res.send(customer);
    } catch (err) {
        return res.status(404).send(`Customer with ID ${req.params.id} was not found.`);
    }
});

// POST REQUEST
router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
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
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, {
            new: true
        });
        res.send(customer);
    } catch (err) {
        return express.status(404).send('The customer with the given ID was not found!');
    }
});

// DELETE REQUEST
router.delete('/:id', async (req, res) => {

    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        // Delete customer
        res.send(customer);
    } catch (err) {
        return res.status(404).send(`Customer with ID ${req.params.id} was not found`);
    }




});


module.exports = router;