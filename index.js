const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('data', function(req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
  ]

const info = `<div>Phonebook has info for ${persons.length} people<div/>
            <div> ${new Date()}<div/>`

app.get('/info', (req, res) => {
  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: "invalid data" 
    })
  }
  const names = persons.map(person => person.name)
  if (names.includes(body.name)) {
    return res.status(400).json({
      error: "person already in phonebook"
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000),
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})