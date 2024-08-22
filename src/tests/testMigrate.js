require('../models')
const sequelize = require("../utils/connection");
const cartCreate = require('./createData/cartCreate');
const createCategory = require('./createData/categoryCreate');
const productCreate = require('./createData/productCreate');
const userCreate = require('./createData/userCreate');

const testMigrate = async()=>{

    try{
        await sequelize.sync({ force: true })
        console.log('DB reset ✅');
        await userCreate() //introducimos un usuario
        await createCategory() //introducimos una categoria
        await productCreate()
        await cartCreate()
        process.exit()
    }catch(error){
        console.error(error);
    }
}


testMigrate()