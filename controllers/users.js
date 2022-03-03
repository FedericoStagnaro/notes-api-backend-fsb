const routerUsers = require('express').Router()
const User = require('../models/User')
const messageNotFound = require('../utils/messages')
const bcrypt = require('bcrypt')

routerUsers.get('/', async (request,response,next) => {
    try {
        const users = 
            await User
                    .find({})
                    .populate('notes', { content: 1, date: 1 })

        users
            ? response.status(200).json(users)
            : next(messageNotFound)
    } catch (error) {
        next(error)
    }
    
})

routerUsers.post('/', async (request,response,next) => {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)

    const userObject = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        notes: body.notes
    })

    try {
        const userSaved = await userObject.save()
        return response.status(201).json(userSaved)
    } catch (error) {
        next(error)
    }
    

})

module.exports = routerUsers