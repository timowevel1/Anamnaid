const express = require('express');
const router = express.Router();
const MySQL = require("../database/MySQL");
const Session = require("../services/SessionManagerService");
const Patient = require("../routes/Patient");

router.get("/",async (req, res) => {
    //Get Anamnesia Data belonging to a user
    if(req.body.session){
        //Extract information from token payload
        const profile = Session.verifyToken(req.body.session);
        //If token is invalid 0 gets returned
        if(profile){
            const userID = await Patient.getUserID(profile.email);
            if(userID){
                //If doctor ID is provided, return anamnesia data which is related to the provided doctor
                if(req.body.doctor){
                    MySQL.query('SELECT content FROM anamnesia_filled WHERE user_owner=? AND doctor=?', [userID,req.body.doctor], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send(rows);
                        }
                    });
                } else {
                    //Return all anamnesia data belonging to an user
                    MySQL.query('SELECT content FROM anamnesia_filled WHERE user_owner=?', userID, (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send(rows);
                        }
                    });
                }
            } else res.sendStatus(500);
        } else res.sendStatus(403); //Invalid session token
    } else res.sendStatus(403); //No session token
});


router.post("/",async (req,res) => {
    //Add new user anamnesia data
    if(req.body.session){
        const profile = Session.verifyToken(req.body.session);
        if(profile){
            const id = await Patient.getUserID(profile.email);
            if(id){
                MySQL.query('INSERT INTO anamnesia_filled (content,user_owner,doctor) VALUES (?,?,?)',[req.body.content,id,req.body.doctor],(err, rows) => {
                    if(err){
                        res.sendStatus(500);
                    } else res.sendStatus(200);
                });
            } else res.sendStatus(500);
        } else res.sendStatus(403); //Invalid session token
    } else res.sendStatus(403); //No session token
})


module.exports = { router };