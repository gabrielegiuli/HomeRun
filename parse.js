output = require('./output.js');

module.exports = function(data) {
    
    var outputs = {}
    console.log('Parsed devices:')
    
    for (const device of data.devices) {
        console.log(device)
        outputs[device.id] = new output(device.address)
    }

    return outputs
}