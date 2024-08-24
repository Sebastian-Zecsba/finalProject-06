require('../models')
const request = require('supertest')
const app = require('../app')

const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Purchase = require('../models/Purchase')

const BASE_URL = '/api/v1/purchases'
const BASE_URL_LOGIN = '/api/v1/users'

let TOKEN;
let purchase;
let userIdLogged;
let category
let product
let cart
beforeAll(async()=> {
    const user = {
        email: "sebastian@correo.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL_LOGIN}/login`)
        .send(user)
    
    TOKEN = res.body.token
    userIdLogged = res.body.user.id

    category = await Category.create({name: "Moviles"})
    product = await Product.create({
        title: "Samsung S23 Ultra",
        description: "With 512gb and 12ram, amoled screen and camera with 200px",
        price: 2250,
        categoryId: category.id
    })
    cart = await Cart.create({
        userId: userIdLogged,
        productId: product.id,
        quantity: 5
    })

    const { userId, productId, quantity } = cart

    purchase = {
        userId,
        productId,
        quantity
    }
})

afterAll(async()=> {
    //! Elimina las compras que dependen del producto
    await Purchase.destroy({ where: { productId: product.id } });
    await cart.destroy();
    await product.destroy();
    await category.destroy();
})

test("POST -> BASE_URL, should return statusCode 201, res.body.userId === purchase.userId", async() => {

    const colums = ['userId', 'productId', 'quantity']

    const res = await request(app)
        .post(BASE_URL)
        .send(purchase)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[0][colum]).toBe(purchase[colum])
    })
})

test("GET -> BASE_URL, should return statusCode 200, req.body.length === 1", async() => {

    const res = await request(app)
        .get(BASE_URL)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    //TODO: 1:n
    expect(res.body[0].userId).toBeDefined()
    expect(res.body[0].userId).toBe(userIdLogged)
    expect(res.body[0].productId).toBeDefined()
    expect(res.body[0].productId).toBe(product.id)
})