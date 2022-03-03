const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { message } = require('../utils/messages')
const validator = require('../utils/validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: [
           { validator: validator.valUsername,
            message: "Username format invalid",name: 'UsernameInvalid'}
        ]
    },
    name: {
        type: String,
        required: true,
        validate: [
            { validator: validator.valName,
            message: 'Name format invalid', name: 'NameInvalid'}
        ]
    },
    passwordHash: {
        type: String,
        required: true
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
})

userSchema.plugin(uniqueValidator,{message: 'The {PATH} {VALUE} is already taken, try a new one.'})

userSchema.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash // the password should not be revealed
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User