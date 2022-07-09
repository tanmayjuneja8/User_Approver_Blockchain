const crypto = require('crypto');
const cryptoHash = (...inputs)=>{
    const hash = crypto.createHash('sha256');

    hash.update(inputs.sort().join(' '));
    //defined it as sorting the inputs , and joining them with spaces
    //now returning the hash in hex form
    return hash.digest('hex');
};

module.exports = cryptoHash;