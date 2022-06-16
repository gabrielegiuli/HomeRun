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

        this.client.subscribe(`${this.topicName}/device_update`)
        this.client.on('message', this.handleMessage)
    }

    handleMessage(topic, message) {
        
        console.log(`${topic}: ${message}`)

        switch (topic) {
            case `${this.topicName}/device_update`:
                this.addAtoll(message)
            default:
                console.log('unkown topic')
        }
    }

    addAtoll(data) {
        
        newAtoll = JSON.parse(data)
        this.atolls(newAtoll.name) = {
            outputs: newAtoll.outputs,
            inputs: newDevnewAtollice.inputs
        }

        console.log('New device added to the list')
    }

    createNewOutput() {

    }

}

module.exports = function(brokerUrl) {
    return new bridge(brokerUrl)
}