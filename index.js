const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()


const app = express()

app.use(cors()) // Permite las peticiones de cualquier IP
app.use(express.static("build"))  // Establece el metodo para el frontend
app.use(express.json()) // parser para ingresos de datos json

let notes = []

// ============================ DATABASE ========================================
const db_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}}@clusterdeprueba.wtvmw.mongodb.net/note-app?retryWrites=true&w=majority`
mongoose.connect(db_url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model("Note", noteSchema)

// =========================== END POINTS =======================================

app.get("/api/notes", (req, res) => {
  Note
    .find()
    .then(notes => {
      res.json(notes)
    })

})

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(nota => nota.id !== id)
  console.log(notes)
  res.status(204).end()
})

const generateID = () => {
  const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxID + 1
}

app.put("/api/notes/:id", (request,response) => {
  const idURL = Number(request.params.id)
  const noteDB = notes.find(n => n.id === idURL)
  console.log(noteDB)
  if (noteDB){
    const newNote = {
      content: request.body.content,
      important: request.body.important || false,
      date: request.body.date ,
      id: idURL
    }
    notes = notes.map(n => n.id !== idURL ? n : newNote)
    return response.status(201).json(newNote)
  }
  else {
    return response.status(400).json({error: "Registro no encontrado"})
  }
})


app.post("/api/notes/", (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: "Content Missing" })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateID()
  }
  notes = notes.concat(note)

  res.json(note)
})

app.use((request,response)=>{
  console.log("hola")
  response.status(404).json({
    error: "Error 404, pagina no encontrada..."})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})