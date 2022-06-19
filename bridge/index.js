const cors = require('cors')
const express = require('express')
const config = require('./config')

const api = require("./routers/api.js")
const web = require("./routers/web")

const app = express()
app.use(cors())
app.use('/api', api)
app.use('/', web)

app.listen(config.server_port, () => {
    console.log(`API server started on http://localhost:${config.server_port}`)
})
