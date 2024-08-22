const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const Cart = require('./Cart')

Product.belongsTo(Category)
Category.hasMany(Product)

//? Tabla pivot Cart

Cart.belongsTo(User)
User.hasMany(Cart)

Cart.belongsTo(Product)
Product.hasMany(Cart)