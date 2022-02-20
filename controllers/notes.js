const notesRouter = require("express").Router()
const { response } = require("express")
const Note = require("../models/Note")
const message = require('../utils/messages')

// ======================= GET =======================

notesRouter.get("/", async (request,response,next) => {
	try {
		const notes = await Note.find()	
		response.json(notes)

	} catch (error) {
		next(error)
	}
})

notesRouter.get("/:id", async (request, response,next) => {
	const { id } = request.params

	try {
		const resFromDb = await Note.findById(id)

		resFromDb
			? response.status(200).json(resFromDb)
			: next(message)

	} catch (error) { next(error) }
})
// ====================== DELETE =====================
notesRouter.delete("/:id", async (request, response,next) => {
	const {id} = request.params

	try {
		const resFromDb = await Note.findByIdAndDelete(id)
		console.log(resFromDb)
		resFromDb 
			? response.status(204).end()
			: next(message)
	} catch (error) {
		next(error)
	}
})

// ======================= PUT =======================

notesRouter.put("/:id", async (request,response,next) => {
	const {id} = request.params
	const body = request.body
	const newNote = {
		content:body.content,
		important:body.important
	}
	try {
		const resFromDb = await Note.findByIdAndUpdate(id,newNote,{returnDocument: "after"})
		resFromDb
			? response.status(200).json(resFromDb)
			: next(message)
	} catch (error) {
		next(error)
	}
})
    
// ======================= POST =======================

notesRouter.post("/", async (request, response,next) => {
	const body = request.body

	if (!body.content) {
		return response.status(400).json({ error: "Content Missing" })
	}
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	try {
		const resFromDb = await note.save()
		response.status(201).json(resFromDb)
	} catch (error) {
		next(error)
	}
})

module.exports = notesRouter