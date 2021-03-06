const supertest = require('supertest')

const app = require('../app')
const server = require('../index')

const mongoose = require('mongoose')
const Note = require('../models/Note')

const helper = require('./test_notes_helper')
const notesRouter = require('../controllers/notes')

const api = supertest(app)

beforeEach(async ()=> {
    await Note.deleteMany({})
    
    const noteOnjectArray = helper.INITIAL_NOTES.map( note => new Note(note))
    const promiseArray = noteOnjectArray.map( note => note.save())
    await Promise.all(promiseArray)

    
})

describe.skip('GET /api/notes', () => {
    test('get all notes as JSON' , async () => {
        await api
                 .get('/api/notes')
                 .expect(200)
                 .expect('Content-Type',/json/)
    })
     
    test('get all notes in db', async () => {
         const response = await api.get('/api/notes')
         expect(response.body).toHaveLength(helper.INITIAL_NOTES.length)
    })
     
    test('get all and first note content', async () => {
         const response = await api.get("/api/notes")
         const contents = response.body.map(note => note.content)
         expect(contents).toContain('HTML is easy')
    })

    test('get one note by ID', async () => {
        const notesInDb = await helper.notesInDb()
        const first_note = notesInDb[0]
        

        const response = await api.get(`/api/notes/${first_note.id}`).expect(200)
        expect(response.body).toEqual(notesInDb[0])

    })

    test('get one note by a non-existed ID', async () => {
        const noteNon_existed_id = await helper.nonExistingId()
    
        const response = await api
                                .get(`/api/notes/${noteNon_existed_id}`)
                                .expect(404)
        
        expect(response.body).toEqual({error: "Id not founded..."})
    })

    test('get one note by id malformated', async () => {
        const id_malformated = "1234"

        const response = await api
                                .get(`/api/notes/${id_malformated}`)
                                .expect(400)

        expect(response.body).toEqual({error: "malformatted id"})
    })
})

describe.skip('PUT /api/notes/id', () => {
    test('Update an existent note', async ()=>{
        const notesInDb = await helper.notesInDb()
        const noteToUpdate = notesInDb[0]

       const  newNote = {
            ...noteToUpdate,
            content: "Updated Note"
        }

        const response = await api
                    .put(`/api/notes/${noteToUpdate.id}`)
                    .send(newNote)
                    .expect(200)
        
        expect(response.body).toEqual(newNote)
    })

    test('Update a non-existed note',async () => {
        const newNote = {
            content: "Updated Note",
            important: true,
            id: await helper.nonExistingId(),
            date: new Date()
        }
        const id_non_existent = newNote.id

        const response = await api.put(`/api/notes/${id_non_existent}`).send(newNote).expect(404)
        expect(response.body).toEqual({error: "Id not founded..."})
    
    })

    test('Update a note with a malformated id',async () => {
        const newNote = {
            content: "Updated Note",
            important: true,
            id: '1234',
            date: new Date()
        }
        const id_non_existent = newNote.id

        const response = await api.put(`/api/notes/${id_non_existent}`).send(newNote).expect(400)
        expect(response.body).toEqual({error: "malformatted id"})
    })
})

describe.skip('POST /api/notes', ()=> {
    test('a valid note can be added', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }
    
        await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect('Content-Type', /json/)
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.INITIAL_NOTES.length + 1)
    
        const contents = notesAtEnd.map(note => note.content)
        expect(contents).toContain('async/await simplifies making async calls')
    })
    
    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }
    
        await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)
    
        const notesAtEnd = await  helper.notesInDb()
    
        expect(notesAtEnd).toHaveLength(helper.INITIAL_NOTES.length)
    })
})

describe.skip('DELETE /api/notes/id', ()=> {

    test('correct id', async() => {
        const notesInDb = await helper.notesInDb()
        const noteToDelete = notesInDb[0]

        await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204)
        
        const notes = await helper.notesInDb()
        expect(notes).not.toContain(noteToDelete)
    })

    test('malformated id', async () => {
        const notesBefore = await helper.notesInDb()
        const noteToDelete = {
            id: "1234"
        }

        await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(400)

        const notesAfter = await helper.notesInDb()
        expect(notesAfter.length).toBe(notesBefore.length)
    })

    test('non-existed id', async () => {
        const notesBefore = await helper.notesInDb()
        const noteToDelete = {
            id: '620ec556206aec8703a067b6'
        }

        await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(404)

        const notesAfter = await helper.notesInDb()
        expect(notesAfter.length ).toEqual(notesBefore.length)
    })

})

afterAll(async() => {
    await mongoose.connection.close()
    server.close()
})