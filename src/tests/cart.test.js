require('../models')
const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/carts'
const BASE_URL_LOGIN = '/api/v1/users'

const cart = {
    userId: 1,
    productId: 1,
    quantity: '5'
}

let TOKEN;
let cartId;

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

test("POST ->  BASE_URL, should return statusCode 201, res.body.userId === cart.userId", async() => {
    const res = await request(app)
        .post(BASE_URL)
        .send(cart)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    cartId = res.body.id

    const colums = [ 'userId', 'productId', 'quantity']
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(cart[colum])
    })
})

test("GET -> BASE_URL, should return statusCode 200, res.body.length === 1", async() => {
    const res = await request(app)
        .get(BASE_URL)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET -> BASE_URL/cartId, should return statusCode 200, res.body.userId === cart.userId", async() => {
    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    const colums = [ 'userId', 'productId', 'quantity']

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(cart[colum])
    })
})

test("PUT -> BASE_URL, should return statusCode 200, res.body.userId === cartUpdate.userId", async() => {

    const cartUpdate = {
        userId: 1,
        productId: 1,
        quantity: '2'
    }

    const res = await request(app)
        .put(BASE_URL)
        .send(cartUpdate)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    const colums = [ 'userId', 'productId', 'quantity']

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(cartUpdate[colum])
    })
})

test("DELETE -> BASE_URL, should return statusCode 204", async() => {
    const res = await request(app)
        .delete(BASE_URL)
        .set(`Authorization`, `Bearer ${TOKEN}`)
        
    expect(res.statusCode).toBe(204)
})