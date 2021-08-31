const express = require("express");
const app = express();
const Blockchain = require("./blockchain");
const bodyParser = require("body-parser");
const PubSub = require('./pubsub');
const request = require('request');

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
})

app.post("/api/mine", (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect("/api/blocks");
});

const syncChain = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            const rootchain = JSON.parse(body);
            console.log(' chain sync... ', rootchain)
            blockchain.replaceChain(rootchain);
        } else {
            console.log(err, response.status);
        }
    });
}



let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}


const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(` listening on ${PORT} `);
    if (PORT != DEFAULT_PORT) {
        syncChain();
    }
});