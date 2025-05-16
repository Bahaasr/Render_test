const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if(note){
    response.json(note)
  }else{
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const generateid = () => {
    const maxId = Math.max(0, ...notes.map(n => Number(n.id)))
  return maxId + 1
  }

  if(!request.body.content){
    return response.status(400).json({error: "content missing"})
  }

  const note = {
    "content" : request.body.content,
    "important" : request.body.important,
    "id" : generateid()
  }

  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request,response) => {
const id = request.params.id
notes = notes.filter(n => n.id !== id)

response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})