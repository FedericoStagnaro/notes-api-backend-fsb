const Note = require('../models/Note')

const INITIAL_NOTES = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
      },
      {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
      }
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    INITIAL_NOTES, nonExistingId, notesInDb
}