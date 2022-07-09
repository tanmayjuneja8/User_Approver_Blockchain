const Block = require('./block');
const cryptoHash = require('./crypto-hash');
class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    static addBlock(lastBlock,id,data,dataid){
        const newBlock = Block.mineBlock({
            lastBlock,
            dataid,
            data,
            id
        });
        return newBlock;
        //this.chain.push(newBlock);
    }

    // replaceChain(chain){
    //     if(chain.length<=this.chain.length){
    //         console.error('Incoming chain must be longer');
    //         return;
    //     }

    //     if(!Blockchain.isValidChain(chain)){
    //         console.error('Incoming chain must be valid');
    //         return;
    //     }

    //     this.chain = chain;
    //     console.error('Chain replaced');
    // }

    // static isValidChain(chain) {
    //     if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
    //     {
    //         return false;
    //     }

    //     for(let i = 1; i < chain.length; i++)
    //     {
    //         const actualLastHash = chain[i-1].hash;
    //         const {timestamp,lastHash, hash,nonce,difficulty,data} = chain[i];
    //         const lastdiff = chain[i-1].difficulty;
    //         if(lastHash!==actualLastHash)
    //         {
    //             return false;
    //         }
    //         const validatedHash = cryptoHash(timestamp,lastHash,data,nonce,difficulty);
    //         if(hash!==validatedHash){
    //             return false;
    //         }

    //         if(lastdiff - difficulty > 1 || lastdiff - difficulty < -1)
    //         {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}

module.exports = Blockchain;