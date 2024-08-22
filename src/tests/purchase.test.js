require('../models')
const request = require('supertest')
const app = require('../app')
const Cart = require('../models/Cart')

const BASE_URL = '/api/v1/purchases'
const BASE_URL_LOGIN = '/api/v1/users'

let TOKEN;

beforeAll(async()=> {
    const user = {
        email: "sebastian@correo.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL_LOGIN}/login`)
        .send(user)
    
    TOKEN = res.body.token
})

test("POST -> BASE_URL, should return statusCode 201, res.body.userId === purchase.userId", async() => {

    const cart = await Cart.findAll()
    const { userId, productId, quantity } = cart[0].dataValues
    const purchase = {
        userId,
        productId,
        quantity
    }

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
})