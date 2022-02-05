const notesRouter = require("express").Router()
const { response } = require("express")
const Note = require("../models/Note")

notesRouter.get("/", (request,response,next) => {
    Note
        .find()
        .then(notes => {
            response.json(notes)
        })
        .catch(error => next(error))
})

notesRouter.get("/:id", (request, response,next) => {
	const { id } = request.params
	Note
		.findById(id)
		.then(note => response.json(note))
		.catch(err => next(err))
})

notesRouter.delete("/:id", (request, response,next) => {
	const {id} = request.params
	Note
		.findByIdAndDelete(id)
		.then(() =>  response.status(204).end())
		.catch(err => next(err))
    
})

notesRouter.put("/:id", (request,response,next) => {
	const {id} = request.params
	const body = request.body
	const newNote = {
		content:body.content,
		important:body.important
	}
	Note.findByIdAndUpdate(id,newNote,{returnDocument: "after"})
		.then(noteUpdated => response.status(200).json(noteUpdated))
		.catch(err => next(err))
})
    
notesRouter.post("/", (request, response,next) => {
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
		.then(savedNote => {return savedNote.toJSON()} )
		.then(savedAndFormatedNote => response.status(201).json(savedAndFormatedNote))
		.catch(err => next(err))
    
})

module.exports = notesRouter