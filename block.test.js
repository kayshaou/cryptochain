const Block = require('./block');
const { GENESIS_BLOCK, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')

describe('Block', () => {
    const lastHash = 'foo-hash';
    const timestamp = 2000;
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('has a timestamp, lastHash, hash, and data propert', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        it('return a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        })
        it('returns the genesis ', () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK);
        })
    });

    describe('minedBlock', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.minedBlock({ lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        })

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        })

        it('set the `data` ', () => {
            expect(minedBlock.data).toEqual(data);
        })

        it('set a `timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        })

        it('creates a SHA-256 `hash` based on the proper inputs ', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, minedBlock.nonce,
                minedBlock.difficulty,
                lastBlock.hash,
                data));
        })

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty))
        })

    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100 }))
                .toEqual(block.difficulty + 1);
        });
        it('lower the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100 }))
                .toEqual(block.difficulty - 1);
        });
    });



});
