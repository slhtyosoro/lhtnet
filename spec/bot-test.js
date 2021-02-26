require = require("esm")(module/*, options*/)
const lhtnet = require('..').default

class Entity {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
Entity.protocol = {
    x: lhtnet.Float32,
    y: lhtnet.Float32,
}

const config = {
    ID_BINARY_TYPE: lhtnet.UInt16,
    TYPE_BINARY_TYPE: lhtnet.UInt8,
    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype',
    HIDE_LOGO: true,
    protocols: {
        entities: [
            ['Entity', Entity]
        ]
    }
}


const protocolMap = new lhtnet.ProtocolMap(config, lhtnet.metaConfig)
const bot = new lhtnet.Bot(config, protocolMap)

bot.onConnect(response => {
    console.log('Bot attempted connection, response:', response)
})

bot.onClose(() => {
    console.log('closed')
})

console.log('trying to connect')
bot.connect('ws://localhost:8079', {})
