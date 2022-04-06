require('dotenv').config() // sert pour récupérer les données d'un fichier .env

const express = require('express')
// const bodyParser = require('body-parser')
const app = express()
const port = 3000

// const db = require('./queries')

// Prise en charge des formulaires HTML.
app.use(express.urlencoded({ extended: true }))
// Prise en charge du JSON.
app.use(express.json())

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
