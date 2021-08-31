const PubNub = require("pubnub");
const credentials = {
    publishkey: "pub-c-f3a3b4ad-a1c0-4b02-96d0-e4ade87ab9c8",
    subscribekey: "sub-c-d51690cc-067c-11ec-9478-0664d1b72b66",
    secretkey: "sec-c-MDE4ZDRlYzctYjQ5OS00YmQyLWI5MmItNzQ5MGQ0ODQwNWU2"
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