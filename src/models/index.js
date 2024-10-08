const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const Cart = require('./Cart')
const Purchase = require('./Purchase')
const ProductImg = require('./ProductImg')

Product.belongsTo(Category)
Category.hasMany(Product)

//? Tabla Cart

Cart.belongsTo(User)
User.hasMany(Cart)

Cart.belongsTo(Product)
Product.hasMany(Cart)

//? Tabla Purchase

Purchase.belongsTo(User)
User.hasMany(Purchase)

Purchase.belongsTo(Product)
Product.hasMany(Purchase)

//? Tabla ProductImg

ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)