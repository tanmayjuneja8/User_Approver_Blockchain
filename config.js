const MINE_RATE = 1000;
//set in milliseconds
const INITIAL_DIFFICULTY = 12;

const GENESIS_DATA = {
    timestamp: 1,
    lasthash: '-----',
    hash: 'hash-one',
    difficulty : INITIAL_DIFFICULTY,
    nonce : 0,
    data:"This is Genesis Block",
    dataid:"Block1dataid",
    id:"Genesis"
};

module.exports = {GENESIS_DATA,MINE_RATE};