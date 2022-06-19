const mqtt = require('mqtt')

class bridge {
    
    constructor(brokerUrl, topicName) {

        this.atolls = {}
        this.outputs = {}

        this.brokerUrl = brokerUrl
        this.topicName = topicName
        this.client = mqtt.connect(brokerUrl)

        this.client.on('connect', () => {
            this.client.publish(`${this.topicName}/general`, 'bridge_connected')
            console.log(`MQTT bridge connected to ${this.brokerUrl}`)
        })

        this.client.subscribe(`${this.topicName}/#`)
        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message)
        })

    }

    handleMessage(topic, message) {
        
        console.log(`${topic}: ${message}`)

        switch (topic) {
            case `${this.topicName}/atoll_update`:
                this.atollUpdate(message)
            default:
                console.log('unkown topic')
        }
    }

    atollUpdate(data) {
        
        const newAtoll = JSON.parse(data)

        this.atolls[newAtoll.name] = {
            outputs: newAtoll.outputs,
            inputs: newAtoll.inputs
        }

        console.log('New device added to the list')
    }

    createNewOutput() {
        console.log("poop")
    }

}

module.exports = function(brokerUrl, topicName) {
    return new bridge(brokerUrl, topicName)
}