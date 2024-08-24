const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Cart.findAll(
        {where: {userId}, 
        include: [{
            model: Product,
            attributes: {exclude: ['updatedAt', 'createdAt']},
            include: [{
                model: Category,
                attributes: ['name']
            }]

        }]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { id } = req.user
    const { productId, quantity } = req.body

    const validProduct = await Product.findOne({ where: { id: productId } });
    if(!validProduct) return res.status(404).json({ message: 'Product not found' })

    const cart = {
        userId: id,
        productId,
        quantity
    }

    const result = await Cart.create(cart);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const userId = req.user.id

    const result = await Cart.findOne(
        {where: {userId}, 
        include: [{
            model: Product,
            attributes: {exclude: ['updatedAt', 'createdAt']},
            include: [{
                model: Category,
                attributes: ['name']
            }]

        }]});
    if(!result) return res.sendStatus(404);

    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const userId = req.user.id;
    const { id } = req.user

    const result = await Cart.destroy({ where: {id, userId} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params
    const { quantity } = req.body
    const userId = req.user.id;
    
    const result = await Cart.update({quantity}, {where: {id, userId}, returning: true});

    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}