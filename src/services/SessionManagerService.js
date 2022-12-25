require("dotenv").config();
const JWT = require('jsonwebtoken');
const MySQL = require("../database/MySQL");

function generateToken(id, email) {
    return JWT.sign(
        {
            mail: email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "31d",
        });
}

function verifyToken(token) {
    return JWT.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if(err){
            return 0;
        } else {
            return decoded;
        }
    });
}

function updateToken(id,email){
    return new Promise((resolve,reject) => {
        const token = generateToken(id,email);
        MySQL.query('UPDATE patient SET session=? WHERE id=?',[token,id],(err,rows) => {
            if(err){
                reject(0);
            } else resolve([1,token]);
        });
    })
}
module.exports = { updateToken, verifyToken }
