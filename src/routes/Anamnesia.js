const express = require('express');
const router = express.Router();
const MySQL = require("../database/MySQL");
const Session = require("../services/SessionManagerService");
const Patient = require("../routes/Patient");
const JWT = require("jsonwebtoken");

router.get("/",async (req, res) => {
    //Get all Anamnesia Data belonging to a user
    if(req.body.session && Session.verifyToken(req.body.session)){
        const profile = Session.verifyToken(req.body.session);
        if(profile){
            console.log(profile.email)
            let id = await Patient.getUserID(profile.email);
            console.log(id)
            if(id){
                MySQL.query('SELECT content FROM anamnesia_filled WHERE user_owner=?',id,(err, rows) => {
                    if(err){
                        res.sendStatus(500);
                    } else {
                        res.send(rows);
                    }
                });
            } else res.sendStatus(500);
        }
    } else res.sendStatus(403);
});


router.post("/",(req,res) => {

})


module.exports = {router};