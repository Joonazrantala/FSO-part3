const express = require('express')
var morgan = require("morgan")
const cors = require("cors")
const app = express()

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.send(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  console.log(typeof(id))
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const person_to_add = request.body
  const check_if_exists = () => {
    if (persons.find(person => person.name === person_to_add.name)) {
      return true
    } else {
      return false
    }
}
  
  if (!person_to_add.name || !person_to_add.number) {
    response.status(400).send("Name or number is missing")
  } else if (check_if_exists()) {
    response.status(400).send("Person is already on the phonebook!")
  } else {
    const randomid = String(Math.floor(Math.random() * 1000000000))
    person_to_add.id = randomid
    persons = persons.concat(person_to_add)
    response.send(person_to_add)
  }
}) 

app.get("/info", (request, response) => {
  response.send(`
    <p style="font-size: 20px">Phonebook has info of ${persons.length} people</p>
    <p style="font-size: 20px">${Date()}</p>`
  )
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})