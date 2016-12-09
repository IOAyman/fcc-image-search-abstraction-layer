const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')


// setup env
try {
  fs.accessSync(`${__dirname}/.env`, fs.constants.R_OK)
  require('dotenv').config()
} catch (error) { console.warn(error) }


// setup app
const app = express()


// setup db
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_USER_PASS } = process.env
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${DB_USER}:${DB_USER_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)
mongoose.connection.on('connected', () => console.info('DB connected!'))
mongoose.connection.on('error', console.error)


// routes
app.use('/api', require('./routes'))

// about this project
app.all('*', (req, res, next) => res.end(`
Hi, you curious (^_^). I'm Ayman Nedjmeddine.
Plase find details at https://github.com/IOAyman/fcc-image-search-abstraction-layer
`))


// go!
app.on('error', console.error)
app.listen(process.env.NODE_PORT || process.env.PORT || 8000)
