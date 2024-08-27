require('../models')
const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
const Category = require('../models/Category')

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users'

let cart;
let category;
let TOKEN;
let cartId;
let product;
let userIdLogged;

beforeAll(async()=> {
    const user = {
        email: "sebastian@correo.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL_LOGIN}/login`)
        .send(user)
    
    TOKEN = res.body.token

    category = await Category.create({name: "Moviles"})
    product = await Product.create({
        title: "Samsung S23 Ultra",
        description: "With 512gb and 12ram, amoled screen and camera with 200px",
        price: 2250,
        categoryId: category.id
    })

    userIdLogged = res.body.user.id

    cart = {
        userId: userIdLogged,
        productId: product.id,
        quantity: 5
    }
})

afterAll(async()=> {
    await category.destroy()
    await product.destroy()
})

test("POST ->  BASE_URL, should return statusCode 201, res.body.userId === cart.userId", async() => {
    const res = await request(app)
        .post(BASE_URL)
        .send(cart)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    cartId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.userId).toBe(cart.userId)

})

test("GET -> BASE_URL, should return statusCode 200, res.body.length === 1", async() => {
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

test("GET -> BASE_URL/cartId, should return statusCode 200, res.body.userId === cart.userId", async() => {
    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.userId).toBe(cart.userId)

    //TODO: 1:n
    expect(res.body.userId).toBeDefined()
    expect(res.body.userId).toBe(userIdLogged)
    expect(res.body.productId).toBeDefined()
    expect(res.body.productId).toBe(product.id)
})

test("PUT -> BASE_URL, should return statusCode 200, res.body.userId === cartUpdate.userId", async() => {

    const cartUpdate = {
        userId: userIdLogged,
        productId: product.id,
        quantity: 2
    }

    const res = await request(app)
        .put(`${BASE_URL}/${cartId}`)
        .send(cartUpdate)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.userId).toBe(cartUpdate.userId)
    expect(res.body.quantity).toBe(cartUpdate.quantity)

    //TODO: 1:n
    expect(res.body.userId).toBeDefined()
    expect(res.body.userId).toBe(userIdLogged)
})

test("DELETE -> BASE_URL, should return statusCode 204", async() => {
    const res = await request(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})