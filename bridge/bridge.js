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

    // Update atoll list from atolls mqtt data
    atollUpdate(data) {
        
        try {
            const newAtoll = JSON.parse(data)

            this.atolls[newAtoll.name] = {
                outputs: newAtoll.outputs,
                inputs: newAtoll.inputs
            }
        } catch (error) {
            console.error(error)
        }

    }

    // Send status update to atoll
    setOutput(deviceId, outputId, state) {
        
        if (!deviceId in this.atolls) {
            console.error(`Atoll ${deviceId} is not connected`)
            return;
        }

        const atoll = this.atolls[deviceId]

        if (!outputId in atoll) {
            console.error(`Output ${deviceId} is not available`)
            return
        }

        this.client.publish(`${this.topicName}/${deviceId}`, JSON.stringify({
            "outputId": outputId,
            "state": state
        }))
    }

}

module.exports = function(brokerUrl, topicName) {
    return new bridge(brokerUrl, topicName)
}