const config = require('./config.js')
const system_setup = require('./system_setup.json')

const parse = require('./parse.js')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// Create data structure
var outputs = parse(system_setup)

// Configuring middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/devices', (req, res) => {
    res.json(outputs)
})

app.post('/set_state', (req, res) => {
    const id = req.body.id
    const state = req.body.state

    outputs[id].state = state

    res.sendStatus(202)
})

app.listen(config.server_port, () => {
    console.log(`Server started on http://localhost:${config.server_port}`)
})