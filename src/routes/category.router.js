const { getAll, create, remove } = require('../controllers/category.cotroller');
const express = require('express');
const { verifyJwt } = require('../utils/verify');

const routerCategory = express.Router();

routerCategory.route('/')
    .get(getAll)
    .post(verifyJwt, create);

routerCategory.route('/:id')
    .delete(verifyJwt, remove)

module.exports = routerCategory;