const Blockchain = require("./blockchain");
const Block = require("./block");

describe('Blockchain()', () => {
    // when test runs its in random order. we need to reset it before the new test case is executed
    let blockchain, newchain, originalchain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newchain = new Blockchain();
        originalchain = blockchain.chain;
    });

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    });

    it('contains genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
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

            beforeEach(() => {
                blockchain.addBlock({ data: 'Bears' });
                blockchain.addBlock({ data: 'Beets' });
                blockchain.addBlock({ data: 'Battlestar Galactica' });
            });
            describe('add a lasthash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                });
            });

            describe('add the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'bad-field';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                });
            });

            describe('add the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                });
            });

        });

    });

    describe('replaceChain()', () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        })
        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                newchain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newchain.chain);
            })
            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalchain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            })
        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newchain.addBlock({ data: 'Bears' });
                newchain.addBlock({ data: 'Beets' });
                newchain.addBlock({ data: 'Battlestar Galactica' });
            })
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    //tampered with
                    newchain.chain[2].hash = 'some-fake-hash';
                    blockchain.replaceChain(newchain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalchain);
                    // new chain must equ to original
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                })
            })
            describe('and the chain is valid', () => {
                beforeEach(() => {
                    // chain must be replaced
                    blockchain.replaceChain(newchain.chain);
                })
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newchain.chain);
                });
                it('logs about chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                })
            });

        })




    })


});
