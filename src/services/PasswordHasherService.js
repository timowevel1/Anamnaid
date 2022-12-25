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
        return await argon2.verify(hash, password);
    } catch (err) {
        console.log("Errr with verifying password.")
    }
}


module.exports = { hashPassword, verifyPassword }