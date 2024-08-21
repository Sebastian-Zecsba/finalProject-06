const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const bcrypt = require('bcrypt')

const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

//? Hooks funciones que se ejecutan antes de que corra x test haga x cosa

User.beforeCreate(async(user) => {
   const passwordToHash = user.password
   const passwordHashed = await bcrypt.hash(passwordToHash, 10)
   user.password = passwordHashed
})

module.exports = User;