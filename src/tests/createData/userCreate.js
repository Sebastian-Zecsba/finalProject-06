const User = require("../../models/User")

const  userCreate = async() => {
    const user = { 
        firstName: "Sebastian",
        lastName: "Casallas",
        email: "sebastian@correo.com",
        password: "1234",
        phone: "123456789"
    }

    await User.create(user)
}

module.exports = userCreate