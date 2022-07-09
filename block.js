const { GENESIS_DATA , MINE_RATE} = require("./config");
const cryptoHash = require("./crypto-hash");
const hexToBinary = require('hex-to-binary');


class Block{
    constructor({timestamp, lasthash,hash,id,data,dataid,nonce,difficulty}){
        this.timestamp =timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.id = id;
        this.data = data;
        this.dataid = dataid;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis(){
        return (GENESIS_DATA);
    }

    static mineBlock({lastBlock,dataid, data,id}){
        let hash,timestamp;
        const lasthash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock:lastBlock, timestamp});
            hash = cryptoHash(timestamp,lasthash,dataid,nonce,difficulty);
        }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));
        
        return ({
            timestamp,
            lasthash,
            data,
            dataid,
            id,
            difficulty,
            nonce,
            hash
        });
    }

    static adjustDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;

        const diff = timestamp - originalBlock.timestamp;
        if(diff > MINE_RATE){
            if(difficulty<=1)
            {
                return 1;
                //atleast 1 leading zero
            }
            return difficulty - 1;
        }
        else
        {
            return difficulty + 1;
        }
    }
}

module.exports = Block;