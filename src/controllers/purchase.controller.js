const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Purchase.findAll(
        {where: {userId}, 
        include: [{
            model: Product,
            attributes: {exclude: ['updatedAt', 'createdAt']},
            include: [{
                model: Category,
                attributes: ['name']
            }],
            include: [{
                model: ProductImg
            }]

        }]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id

    const cartItems = await Cart.findAll({
        where: {userId},
        raw: true,
        attributes: ['quantity', 'userId', 'productId']
    })

    const purchases = await Purchase.bulkCreate(cartItems)
    
    await Cart.destroy({ where: { userId } });

    return res.status(201).json(purchases);
});

module.exports = {
    getAll,
    create
}