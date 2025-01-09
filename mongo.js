const mongoose = require("mongoose")

mongoose.connection.close()
const password = process.argv[2]
const newname = process.argv[3]
const newnumber = process.argv[4]
const id = String(Math.floor(Math.random() * 1000000000))
const url = `mongodb+srv://fullstack:${password}@cluster0.7h4xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

const newperson = new Person({
    id: id,
    name: newname,
    number: newnumber
})

if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log("phonebook: ")
        persons.forEach(person => {
            console.log(person.name, person.number)
        })

    mongoose.connection.close()
    })
} else {
newperson.save().then(result => {
    console.log(`Added ${newname} number ${newnumber} to phonebook`)
    mongoose.connection.close()
    })
}