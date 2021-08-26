const Block = require('./block');
const cryptoHash = require('./crypto-hash');
class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }
    addBlock({ data }) {
        const newBlock = Block.minedBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock);
    }
    static isValidChain(chainarray) {
        if (JSON.stringify(chainarray[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let idx = 1; idx < chainarray.length; idx++) {
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chainarray[idx];
            // compare lasthash must be same as currentHash
            //// extract last hash 
            const prevHash = chainarray[idx - 1].hash;
            const prevDiff = chainarray[idx - 1].difficulty;
            //// then compare w current hash
            if (prevHash !== lastHash) return false;

            // check if the hash is correctly encrypted
            const validatedHash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;

            if (Math.abs(prevDiff - difficulty) > 1) return false;
        }
        // if all are well then it will reach this return point
        return true;
    }
    // cannot be static cos it based on the individual instance.
    replaceChain(chainarray) {
        if (chainarray.length <= this.chain.length) {
            console.error('The incoming chain must be longer')
            return;
        }
        if (!Blockchain.isValidChain(chainarray)) {
            console.error('The incoming chain must be valid')
            return;
        }
        console.log('Replacing chain with, ', chainarray);
        this.chain = chainarray;
    }
}

module.exports = Blockchain;