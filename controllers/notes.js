const routerNotes = require("express").Router()
const Note = require("../models/Note")
const User = require('../models/User')
const message = require('../utils/messages')

// ======================= GET =======================

routerNotes.get("/", async (request,response,next) => {
	try {
		const notes = 
			await Note
				.find({})
				.populate('userId',{username: 1, name: 1})
		
		notes 
		? response.status(200).json(notes)
		: next(message)
	} catch (error) {
		next(error)
	}
})

routerNotes.get("/:id", async (request, response,next) => {
	const { id } = request.params

	const resFromDb = await Note.findById(id)

	resFromDb
		? response.status(200).json(resFromDb)
		: next(message)
})
// ====================== DELETE =====================

routerNotes.delete("/:id", async (request, response,next) => {
	const {id} = request.params

	const resFromDb = await Note.findByIdAndDelete(id)
	
	resFromDb 
		? response.status(204).end()
		: next(message)
})

// ======================= PUT =======================

routerNotes.put("/:id", async (request,response,next) => {
	const {id} = request.params
	const body = request.body
	const newNote = {
		content:body.content,
		important:body.important
	}
	const resFromDb = await Note.findByIdAndUpdate(id,newNote,{returnDocument: "after"})
	resFromDb
		? response.status(200).json(resFromDb)
		: next(message)
})
    
// ======================= POST =======================

routerNotes.post("/", async (request, response,next) => {
	const body = request.body

	if (!body.content) { return response.status(400).json({ error: "Content Missing" })}
	console.log(body)

	const user = await User.findById(body.userId)
	console.log(user.id)

	
	
	const newNote = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
		userId: user._id
	})
	console.log(newNote)

	const savedNote = await newNote.save()

	await User.findByIdAndUpdate(user._id,{ $set:  { notes: user.notes.concat(savedNote._id) }})
	response.status(201).json(savedNote)
})

module.exports = routerNotes