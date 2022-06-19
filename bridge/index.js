const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config.json')
const bridge = require('./bridge')

const app = express()
const mqtt = bridge(config.broker.url, config.broker.topic)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/atolls_list', (req, res) => {
    res.json(mqtt.atolls)
})

app.post('/set_output', (req, res) => {
    mqtt.setOutput(req.body.deviceId, req.body.outputId, req.body.state)
    res.sendStatus(200)
})

app.listen(config.server_port, () => {
    console.log(`API server started on http://localhost:${config.server_port}`)
})
