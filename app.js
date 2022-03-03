const express = require("express")
const cors = require("cors")
require('express-async-errors')
const mongoose = require("mongoose")
const Note = require("./models/Note.js")
const logger = require("./utils/logger")
const config = require("./utils/config")
const middleware = require("./utils/middlewares")
const routerNotes = require("./controllers/notes")
const routerUser = require('./controllers/users')

const app = express()

// ============================ DATABASE ========================================

logger.info("Conecting to", config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => logger.info("Database connected"))
	.catch(error => logger.error(error))

//=============================== MIDDLEWARES ===================================

app.use(cors())                       // Permite las peticiones de cualquier IP
app.use(express.static("build"))      // Establece el metodo para el frontend
app.use(express.json())               // Parser para ingresos de datos json

//app.use(middleware.requestLogger)

// =========================== END POINTS =======================================

app.use("/api/notes",routerNotes)
app.use('/api/users',routerUser)

// ============================ ERROR HANDLER ================================


app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app