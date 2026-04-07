const fs = require('fs');
const bs58 = require('bs58');

const secret = JSON.parse(fs.readFileSync(process.env.HOME + '/.config/solana/id.json'));

const privateKey = bs58.encode(Uint8Array.from(secret));

console.log("Private Key (Base58):", privateKey);