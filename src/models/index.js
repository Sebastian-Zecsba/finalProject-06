const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')

Product.belongsTo(Category)
Category.hasMany(Product)