const express = require('express')
const valid = require('../utils/validator') 

describe.skip('Check userNames', ()=> {

    test('one word valid', ()=> {
        const username = 'Marianstag'
        const result = valid.valUsername(username)
        expect(result).toBe(true)
    })

    test('two word valid', ()=> {
        const username = 'Raasdas asdasada'
        const result = valid.valUsername(username)
        console.log(result)
        expect(result).toBe(false)
    })

    test('one word invalid', ()=> {
        const username = 'as'
        const result = valid.valUsername(username)
        expect(result).toBe(false)
    })

    test('two word valid', ()=> {
        const username = 'as ds'
        const result = valid.valUsername(username)
        console.log(result)
        expect(result).toBe(false)
    })
})
