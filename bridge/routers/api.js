const express = require('express')
const bridge = require('../bridge')
const config = require('../config.json')
const bodyParser = require('body-parser')

const mqtt = bridge(config.broker.url, config.broker.topic)
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/atolls_list', (req, res) => {
    res.json(mqtt.atolls)
})

router.post('/set_output', (req, res) => {
    mqtt.setOutput(req.body.deviceId, req.body.outputId, req.body.state)
    res.sendStatus(200)
})

module.exports = router