const PubNub = require("pubnub");
const credentials = {
    publishkey: "<pub-key>",
    subscribekey: "<subscribekey>",
    secretkey: "<secret-key>"
}

const CHANNELS = {
    testChannel: 'TEST'
}
class PubSub {
    constructor() {
        this.pubnub = new PubNub();
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());

    }
    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Msg received. Channel: ${channel} Message: ${message}`);
            }
        }
    }
    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}
//test
const test = new PubSub();
test.publish({ channel: CHANNELS.testChannel, message: 'hello pubnub' })
module.exports = PubSub;
