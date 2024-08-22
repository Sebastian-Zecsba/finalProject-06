require('../models')
const sequelize = require("../utils/connection");
const createCategory = require('./createData/categoryCreate');
const userCreate = require('./createData/userCreate');

const testMigrate = async()=>{

    try{
        await sequelize.sync({ force: true })
        console.log('DB reset ✅');
        await userCreate() //introducimos un usuario
        await createCategory() //introducimos una categoria
        process.exit()
    }catch(error){
        console.error(error);
    }
}


testMigrate()