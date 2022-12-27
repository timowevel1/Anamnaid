const express = require('express');
const router = express.Router();
const MySQL = require("../database/MySQL");


router.get("/",(req, res) => {
    if(req.query.token_verification){
        MySQL.query('SELECT token_verification,verified FROM patient WHERE token_verification=?', req.query.token_verification, (err, rows) => {
            if (err) {
                res.sendStatus(500);
            } else {
                if (rows[0]) {
                    //Check if already verified
                    if(!rows[0].verified){
                        MySQL.query('UPDATE patient SET verified=1',(err) => {
                            if(err){
                                res.sendStatus(500);
                            } else res.send("Deine Account wurde erfolgreich verifiziert! Du kannst nun das Fenster schließen und dich in der App anmelden!");
                        });
                    } else {
                        res.send("Dieser Account wurde bereits verifiziert! Du kannst dich in der App anmelden.");
                    }
                } else res.sendStatus(404); //User with provided verification token doesn't exist
            }
        })
    } else console.log(req.params);
});




module.exports = {router};