const { GENESIS_BLOCK } = require('./config')
const cryptoHash = require('./crypto-hash')
class Block {
    constructor({ timestamp, lastHash, hash, data }) { //curly braces; so we dont have to rmb the order to params passed in
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        return new this(GENESIS_BLOCK);
    }

    static minedBlock({ lastBlock, data }) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        })
    }
}
const block1 = new Block({ timestamp: '01/01/01', lastHash: 'foo-lasthash', hash: 'foo-hash', data: 'foo-data' });

module.exports = Block;

