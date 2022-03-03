const logger = require("./logger")

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ID not Founded') { return response.status(404).send( { error: 'Id not founded...'})}
    if (error.name === 'CastError') {return response.status(400).send({ error: 'malformatted id' })} 
    if (error.name === 'ValidationError') {
        if( error.errors.username){return response.status(400).json(error.errors.username.message)}
        if( error.errors.name){return response.status(400).json(error.errors.name.message)}
        return response.status(400).json({ error: error })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler}

