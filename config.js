const MINE_RATE = 1000;
const INTIAL_DIFFICULTY = 3;
const GENESIS_BLOCK = {
    timestamp: 1,
    hash: 'hash-one',
    data: [],
    lastHash: '----',
    difficulty: INTIAL_DIFFICULTY,
    nonce: 0
}

module.exports = { GENESIS_BLOCK, MINE_RATE } 