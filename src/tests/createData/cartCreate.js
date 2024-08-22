const Cart = require("../../models/Cart")

const  cartCreate = async() => {
    const cart = {
        userId: 1,
        productId: 1,
        quantity: '929'
    }

    await Cart.create(cart)
}

module.exports = cartCreate