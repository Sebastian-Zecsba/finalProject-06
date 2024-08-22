const request = require("supertest")
const app = require('../app')

const BASE_URL = '/api/v1/users'
const user = { 
    firstName: "Grabiel",
    lastName: "Martinez",
    email: "gabriel@gmail.com",
    password: "1234",
    phone: "12345678"
}
let TOKEN
let TokenUserLogged
let userId

beforeAll(async()=> {
    const user = {
        email: "sebastian@correo.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)
    
    TOKEN = res.body.token
})


test("POST ->  BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async() => {

    const columns = ['firstName', 'lastName', 'email', 'phone']

    const res = await request(app)
        .post(BASE_URL)
        .send(user)

    userId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    columns.forEach((check) => {
        expect(res.body[check]).toBe(user[check])
    })
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 2", async() => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
})

test("POST -> BASE_URL/login, should return statusCode 200, and res.body.user.email === user.email", async() => {

    const hists = { 
        email: "gabriel@gmail.com",
        password: "1234"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(hists)

    TokenUserLogged = res.body.token

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user).toBeDefined()
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(hists.email)
})

test("POST -> BASE_URL/login, should return statusCode 401", async() => {
    const hists = { 
        email: "gabriel@gmail.com",
        password: "invalidPassword"
    }

    const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hists)

    expect(res.statusCode).toBe(401)

})

test("PUT -> BASE_URL/userId, should return statusCode 200, and res.body.firstName === userUpdate.firstName", async() => {

    const userUpdate = {
        firstName:'Jesus',
        lastName: 'Hernandez'
    }

    const columns = ['firstName', 'lastName']

    const res = await request(app)
        .put(`${BASE_URL}/${userId}`)
        .send(userUpdate)
        .set('Authorization', `Bearer ${TokenUserLogged}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    columns.forEach((check) => {
        expect(res.body[check]).toBe(userUpdate[check])
    })
})

test("DELETE -> BASE_URL/userId, should return statusCode 204", async() => {

    const res = await request(app)
        .delete(`${BASE_URL}/${userId}`)
        .set('Authorization', `Bearer ${TokenUserLogged}`)

    expect(res.statusCode).toBe(204)

})