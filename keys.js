const EC = require('elliptic').ec;
const ec = new EC('curve25519');

let pubkeys = [];
let prikeys = [];

for(let i = 0 ; i < 15; i++)
{
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    pubkeys.push(publicKey);
    prikeys.push(privateKey);
    console.log("Public key: " + publicKey);
    console.log("Private key: " + privateKey);
}

module.exports = {pubkeys,prikeys};