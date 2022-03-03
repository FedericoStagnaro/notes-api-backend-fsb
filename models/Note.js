const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
	content: {
		type:String,
		minlength:5,
		required:true
	},
	date: {
		type:Date,
		required:true
	},
	important: {
		type:Boolean
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}
})

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.date = returnedObject.date.toString( )
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
    

const Note = mongoose.model("Note", noteSchema)
module.exports = Note