const express = require('express');
const router = express.Router();
const MySQL = require("../database/MySQL");
const Session = require("../services/SessionManagerService");
const Patient = require("../routes/Patient");

router.get("/",async (req, res) => {
    //Get Anamnesia Data belonging to a user
    if(req.body.session){
        const profile = Session.verifyToken(req.body.session);
        if(profile){
            let id = await Patient.getUserID(profile.email);
            if(id){
                //If doctor ID is provided, return anamnesia data which is related to the provided doctor
                if(req.body.doctor){
                    MySQL.query('SELECT content FROM anamnesia_filled WHERE user_owner=? AND doctor=?', [id,req.body.doctor], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send(rows);
                        }
                    });
                } else {
                    //Return all anamnesia data belonging to an user
                    MySQL.query('SELECT content FROM anamnesia_filled WHERE user_owner=?', id, (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send(rows);
                        }
                    });
                }
            } else res.sendStatus(500);
        } else res.sendStatus(500);
    } else res.sendStatus(403);
});


router.post("/",async (req,res) => {
    //Add new user anamnesia data
    if(req.body.session){
        const profile = Session.verifyToken(req.body.session);
        if(profile){
            let id = await Patient.getUserID(profile.email);
            if(id){
                MySQL.query('INSERT INTO anamnesia_filled (content,user_owner,doctor) VALUES (?,?,?)',[req.body.content,id,req.body.doctor],(err, rows) => {
                    if(err){
                        res.sendStatus(500);
                    } else res.sendStatus(200);
                });
            } else res.sendStatus(500);
        } else res.sendStatus(500);
    } else res.sendStatus(403);
})


module.exports = { router };