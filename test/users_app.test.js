const app = require('../app')
const supertest  = require('supertest')
const User = require('../models/User')
const mongoose = require('mongoose')
const helper = require('./test_user_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

jest.setTimeout(7000)
beforeEach( async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const usersData = [{
        username: 'adminss',
        name: 'root',
        passwordHash: passwordHash,
        notes: []
    }]
    
    const usersObject = usersData.map(user => new User(user))
    const usersPromises = usersObject.map( user => user.save())
    await Promise.all(usersPromises)
})

describe('GET /api/user', () => {

    test('get all', async () => {

        const response = await api.get('/api/users').expect(200).expect('Content-Type', /json/)

        const users = response.body.map(user => user.username)
        expect(users).toContain('adminss')
    })
})

describe('POST /api/user', () => {
    
    test('a valid post', async () => {
        const usersBefore = await helper.userInDb()

        const newUser = {
            username: 'AndresStagnaro',
            name: 'Andres',
            passwordHash: 'CHOCOlate123...',
            notes: []
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAfter = await helper.userInDb()
        const arrayOfNamesSaved = usersAfter.map(user => user.name)

        expect(usersAfter).toHaveLength(usersBefore.length + 1)
        expect(arrayOfNamesSaved).toContain('Andres')
    })

    test('Creation rejected for USERNAME already taken', async () => {
        const usersBefore = await helper.userInDb()

        const newUser = {
            username: usersBefore[0].username,
            name: 'Duplicate',
            passwordHash: 'CHOCOlate123...',
            notes:[]
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await helper.userInDb()
        
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body).toBe(`The username ${newUser.username} is already taken, try a new one.`)
    })

    // Input malformated ======================================

    test('Creation rejected for USERNAME malformated', async () => {
        const usersBefore = await helper.userInDb()

        const newUser = {
            username: 'include_Especial_Caracter',
            name: 'Someone',
            passwordHash: 'CHOCOlate123...',
            notes:[]
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await helper.userInDb()
        
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body).toBe(`Username format invalid`)
    })

    test('Creation rejected for NAME malformated', async () => {
        const usersBefore = await helper.userInDb()

        const newUser = {
            username: 'AnUsername',
            name: 'A name malformated',
            passwordHash: 'CHOCOlate123...',
            notes:[]
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await helper.userInDb()
        
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body).toBe(`Name format invalid`)
    })

    
    // test('Creation rejected for PASSWORD malformated', async () => {
    //     const usersBefore = await helper.userInDb()

    //     const newUser = {
    //         username: 'UserForBadPasswords',
    //         name: 'Ana',
    //         passwordHash: 'chocolate',
    //         notes:[]
    //     }

    //     const response = await api
    //         .post('/api/users')
    //         .send(newUser)
    //         .expect(400)

    //     const usersAfter = await helper.userInDb()
        
    //     expect(usersAfter).toHaveLength(usersBefore.length)
    //     expect(response.body).toBe('The password must contain 8 to 64 characters long and contains a mix of upper and lower case characters, one numeric and one special character')
    // })

})

afterAll(()=>{
    mongoose.connection.close()
})