const Blockchain = require("./blockchain");
const Block = require("./block");

describe('Blockchain()', () => {

    const blockchain = new Blockchain();

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    });

    it('contains genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis);
    })

    it('adds a new block to the chain', () => {
        const newBlock = 'foo bar';
        blockchain.addBlock({ data: newBlock });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newBlock);
    })

    describe('isValidChain', () => {
        describe('when the chain does not start with genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' }
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            });
        });
        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            describe('add a lasthash reference has changed', () => {
                it('returns false', () => {
                    blockchain.addBlock({ data: 'Bears' });
                    blockchain.addBlock({ data: 'Beets' });
                    blockchain.addBlock({ data: 'Battlestar Galactica' });

                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                });
            });

            describe('add the chain contains a block with an invalid field', () => {
                it('returns false', () => {

                });
            });

            describe('add the chain does not contain any invalid blocks', () => {
                it('returns false', () => {

                });
            });



        });

    });


});
