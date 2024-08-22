require('../models')
const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/products'
const BASE_URL_LOGIN = '/api/v1/users'

const product = {
    title: "Samsung S23 Ultra",
    description: "With 512gb and 12ram, amoled screen and camera with 200px",
    price: 2250,
    categoryId: 1
}

let TOKEN;
let productId;

beforeAll(async() => {
    const user = {
        email: "sebastian@correo.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL_LOGIN}/login`)
        .send(user)
    
    TOKEN = res.body.token

})

test("POST -> BASE_URL, should return statusCode 201, res.body.title === product.tile", async() => {
    const colums = ["title", "description", "price", "categoryId"]
    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set(`Authorization`, `Bearer ${TOKEN}`)


    productId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(product[colum])
    })
    
})

test("GET -> BASE_URL, should return statusCode 200, res.body.length === 1", async() => {
    
    const res = await request(app)
        .get(BASE_URL)
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
})

test("GET -> BASE_URL/productId, should return statusCode 200, res.body.title === product.title", async() => {

    const colums = ["title", "description", "price", "categoryId"]
    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)
    


    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(product[colum])
    })
})

test("PUT -> BASE_URL/productId, should return statusCode 200, res.body.title === productUpdated.tile", async() => {

    const colums = ["title", "description", "price", "categoryId"]
    const productUpdated = {
        title: "IPhone 15 pro max",
        description: "1T 8ram and the best camera",
        price: 2300,
        categoryId: 1
    }

    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .send(productUpdated)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(productUpdated[colum])
    })
})

test("DELETE -> BASE_URL/productId, should return statusCode 204", async() => {

    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set(`Authorization`, `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})