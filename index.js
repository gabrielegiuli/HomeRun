// Load configuration files
const config = require('./config.json')
const system_setup = require('./system_setup.json')

// Load modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Create app
const app = express()

// Configure cors
app.use(cors())

// Configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load outputs
var outputs = system_setup.outputs

app.get('/devices', (req, res) => {
    res.json(outputs)
})

app.post('/set_state', (req, res) => {
    const id = req.body.id
    const state = req.body.state

    outputs[id].state = state

    res.sendStatus(200)
})

app.listen(config.server_port, () => {
    console.log(`Server started on http://localhost:${config.server_port}`)
})