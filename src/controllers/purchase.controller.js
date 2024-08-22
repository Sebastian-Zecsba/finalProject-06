const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Purchase.findAll({where: {userId}, include: [Product]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id

    const cartItems = await Cart.findAll({where: {userId}})

    const purchases = [];
    for (const item of cartItems) {
        const { productId, quantity } = item;
        const purchase = await Purchase.create({ userId, productId, quantity });
        purchases.push(purchase);
    }
    
    await Cart.destroy({ where: { userId } });

    return res.status(201).json(purchases);
});

module.exports = {
    getAll,
    create
}