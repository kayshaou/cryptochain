const express = require("express");
const app = express();
const Blockchain = require("./blockchain");
const bodyParser = require("body-parser");
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
})

app.post("/api/mine", (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });

    res.redirect("/api/blocks");

})


const port = process.env.port ? process.env.port : 5000
app.listen(3000, () => {
    console.log(` listening on ${port} `);
})