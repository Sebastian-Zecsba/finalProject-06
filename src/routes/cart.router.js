const { getAll, create, getOne, remove, update } = require('../controllers/cart.controller');
const express = require('express');

const routerCart = express.Router();

routerCart.route('/')
    .get(getAll)
    .post(create)
    .delete(remove)
    .put(update)

routerCart.route('/:id')
    .get(getOne)

module.exports = routerCart;