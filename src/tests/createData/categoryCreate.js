const Category = require("../../models/Category")

const  createCategory = async() => {
    const category = { 
        name: "Moviles"
    }

    await Category.create(category)
}

module.exports = createCategory