const { GENESIS_BLOCK, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')
class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) { //curly braces; so we dont have to rmb the order to params passed in
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_BLOCK);
    }

    static minedBlock({ lastBlock, data }) {
        let hash, timestamp;
        // const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const { difficulty } = lastBlock;
        let nonce = 0; // this will be dynamic
        do {
            nonce++;
            timestamp = Date.now()
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        // as long as the first 0 Ns (no of difficult do not equals N) keep increasing

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;


    }
}
const block1 = new Block({ timestamp: '01/01/01', lastHash: 'foo-lasthash', hash: 'foo-hash', data: 'foo-data' });

module.exports = Block;

