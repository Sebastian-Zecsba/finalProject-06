const Product = require("../../models/Product")

const  productCreate = async() => {
    const product = {
        title: "Samsung S23 Ultra",
        description: "With 512gb and 12ram, amoled screen and camera with 200px",
        price: 2250,
        categoryId: 1
    }

    await Product.create(product)
}

module.exports = productCreate