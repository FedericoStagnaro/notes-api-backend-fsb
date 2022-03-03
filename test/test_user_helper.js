const User = require('../models/User')

const initial_users = [
    {
        username: 'federicostag',
        name: 'fede',
        passwordHash: 'holamundo',
        notes: []
    },
    {
        username: 'leonardocap',
        name: 'leo',
        passwordHash: 'chaumundo',
        notes: []
    }
]

const userInDb = async () => {
    const users = await User.find({})
    const usersParsed = users.map( user => user.toJSON())
    return usersParsed
}

const idUserNonExistent = async () => {
    const newUser = { username: 'I dont must exist' }
    newUser = new User(newUser)
    const userSaved = await newUser.save()
    const idNonExistent = userSaved._id
    await User.findByIdAndDelete(idNonExistent)
    return idNonExistent 
}


module.exports = { initial_users, userInDb, idUserNonExistent}