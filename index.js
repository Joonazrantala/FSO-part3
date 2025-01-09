const express = require('express')
var morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person.js")
const app = express()

morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, req, res, next) => {
  console.error(`error message: ${error.message}`)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      if (person) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.send(savedPerson)
    })
    .catch(error => next(error))
}) 

app.put("/api/persons/:id", (req, res, next) => {
  const newperson = ({
    name: req.body.name,
    number: req.body.number
  })
  Person.findByIdAndUpdate(req.params.id, newperson, {new:true})
    .then(promise => {
      res.send(promise)
    })
    .catch(next => next(error))
})

app.get("/info", (request, response) => {
  Person.countDocuments({}).then(count => {
  response.send(`
    <p style="font-size: 20px">Phonebook has info of ${count} people</p>
    <p style="font-size: 20px">${Date()}</p>`)
  })
    .catch(error => {
      console.log(error)
    })
})

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})