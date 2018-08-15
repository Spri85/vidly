const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
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

router.get('/:id', validateObjectId, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} was not found.`);

    res.send(customer);
});

// POST REQUEST
router.post('/', auth, async (req, res) => {
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
router.put('/:id', [auth, validateObjectId], async (req, res) => {

    // if bad request
    const {
        error
    } = validate(req.body);
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
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} was not found`);

    res.send(customer);
});


module.exports = router;