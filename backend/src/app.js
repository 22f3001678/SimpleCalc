const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const calculatorRoutes = require('./routes/calculatorRoutes')
const historyRoutes = require('./routes/historyRoutes')
const { errorHandler } = require('./middleware/errorHandler')
const { logger } = require('./middleware/logger')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger)
app.use(morgan('dev'))

app.get('/health', (req,res)=> res.json({ status: 'ok' }))
app.use('/api/calculator', calculatorRoutes)
app.use('/api/history', historyRoutes)

app.use(errorHandler)

module.exports = app
