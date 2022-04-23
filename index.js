require('dotenv').config() // sert pour récupérer les données d'un fichier .env

const express = require('express')
const cors = require('cors')

const loggerMiddleware = require('./middlewares/logger')

const app = express()

// autorise les requetes depuis le front react(access control allow origin)
app.use(cors())
// on dit a express d'utiliser le middleware
app.use(loggerMiddleware)

// Prise en charge des formulaires HTML.
app.use(express.urlencoded({ extended: true }))
// Prise en charge du JSON.
app.use(express.json())

const router = express.Router()

const port = process.env.PORT

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.use(router)
app.use('/me', require('./routes/users'))
app.use('/auth', require('./routes/users/auth'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
