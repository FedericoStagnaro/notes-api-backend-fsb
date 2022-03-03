
const valName = (name) => {
    const pattern = /^[a-zA-Z\-]{3,32}$/i
    return pattern.test(name)
}

const valUsername= (username) => {
    const pattern = /^[a-zA-Z0-9]{6,32}$/i
    return pattern.test(username)
}

const valPasswordStrong = (pass) => {
    const pattern = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g
    return pattern.test(pass)
} 

module.exports = { valUsername, valName, valPasswordStrong }