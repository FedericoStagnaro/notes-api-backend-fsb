const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Note = require("./models/Note.js")
const { response } = require("express")
require("dotenv").config()


const app = express()

//=============================== MIDDLEWARES ===================================

app.use(cors())                       // Permite las peticiones de cualquier IP
app.use(express.static("build"))      // Establece el metodo para el frontend
app.use(express.json())               // Parser para ingresos de datos json

// ============================ DATABASE ========================================
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASSWORD
const db_url = `mongodb+srv://${db_user}:${db_pass}@clusterdeprueba.wtvmw.mongodb.net/note-app?retryWrites=true&w=majority`
mongoose
    .connect(db_url)
    .then(() => console.log("Database connected"))
    .catch(error => console.log(error))

// =========================== END POINTS =======================================



app.get("/api/notes", (request, response) => {
    Note
        .find()
        .then(notes => {
            response.json(notes)
        })
})

app.get("/api/notes/:id", (request, response) => {
    const { id } = request.params
    Note
        .findById(id)
        .then(note => response.json(note))
        .catch(err => console.log(err))
})

app.delete("/api/notes/:id", (request, response) => {
    const {id} = request.params
    Note
        .findByIdAndDelete(id)
        .then(() =>  response.status(204).end())
        .catch(err => console.log(err))
    
})

app.put("/api/notes/:id", (request,response) => {
    const {id} = request.params
    console.log(id,typeof(id))
    const body = request.body
    const newNote = {
        content:body.content,
        important:body.important
    }
    Note.findByIdAndUpdate(id,newNote,{returnDocument: "after"})
        .then(noteUpdated => response.status(200).json(noteUpdated))
        .catch(err => console.log(err))
})
    
app.post("/api/notes/", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: "Content Missing" })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    note.save()
        .then(noteCreated => response.status(201).json(noteCreated))
        .catch(err => console.log(err))
    
})


//================================= Error Handler ===========================================

app.use((request,response)=>{
    response.status(404).json({
        error: "Error 404, pagina no encontrada..."})
})

app.use((error,request,response,next) => {
    if (error.mesage === "CastError"){
        response.status(400).send({error:"ID malformated...."})
    }
    next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})