const argon2 = require('argon2');
const {hash} = require("argon2");

async function hashPassword(password){
    try {
        return await argon2.hash(password);
    } catch (err) {
        console.log("Error with hashing password");
        return "Error";
    }
}

async function verifyPassword(hash,password){
    try {
        return argon2.verify(hash, password);
    } catch (err) {
        return 0;
    }
}


module.exports = { hashPassword, verifyPassword }