const express = require('express');
const router = express.Router();
const MySQL = require("../database/MySQL");
const Session = require("../services/SessionManagerService");
const Password = require("../services/PasswordHasherService");
const Email = require("../services/EmailSenderService");
const crypto = require("crypto");
let email_regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;



router.get('/login', (req, res) => {
    //Return user profile data to provided session token
    if (req.body.session) {
        if(Session.verifyToken(req.body.session)) {
            MySQL.query('SELECT email,first_name,last_name,anamnesia_ids,session FROM patient WHERE session=?', req.body.session, (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    if (rows[0]) {
                        res.send(rows[0]);
                    } else res.sendStatus(404); //User with provided session token doesnt exist
                }
            });
        } else res.sendStatus(403);
    } else {
        if (req.body.email) {
            MySQL.query('SELECT id,email,password,first_name,last_name,anamnesia_ids,session FROM patient WHERE email=?', req.body.email, async (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    //Check if there was a matching patient with the provided email
                    if (rows[0]) {
                        //Verify the passed password matches the user password, then update the session token to a new one
                        Password.verifyPassword(rows[0].password, req.body.password).then(async result => {
                            //Check if provided password was correct
                            if (result) {
                                //Obtain new session id and return it to the client
                                const result = await Session.updateToken(rows[0].id, rows[0].email);
                                if (result[0]) {
                                    let profile = rows[0];
                                    //Delete password and id as not needed client side, but not filtered through sql query as it was needed before
                                    delete profile.password
                                    delete profile.id;
                                    //Set the recent session token and send the profile data to the user
                                    profile.session = result[1];
                                    res.send(profile);
                                } else res.send(500); //If there was an error with the MySQL Query in updateToken (SessionManagerService)
                            } else res.send(403); //If provided password doesn't match the password to the provided email address
                        })
                    } else res.sendStatus(404); //User with provided email doesn't exist
                }
            });
        } else res.sendStatus(404);
    }
});

router.post('/register', (req, res) => {
    //Check if all information are provided
    if (req.body.email && req.body.first_name && req.body.last_name && req.body.password) {
        //Check if user with this email already exists
        MySQL.query('SELECT email FROM patient WHERE email=?', req.body.email, async (err, rows) => {
            if (err) {
                res.sendStatus(500);
            } else {
                if (rows[0]) {
                    res.sendStatus(403); //User already exists
                } else {
                    if(req.body.email.match(email_regexp)) { //Check if email has valid pattern
                        const profile = req.body;
                        profile.password = await Password.hashPassword(req.body.password);
                        const token_verification = crypto.randomBytes(64).toString('hex');
                        MySQL.query('INSERT INTO patient (first_name,last_name,email,password,token_verification) VALUES (?,?,?,?,?)', [profile.first_name, profile.last_name, profile.email, profile.password, token_verification], async (err, rows) => {
                            if (err) {
                                res.send(err);
                            } else {
                                Email.sendVerificationMail(profile.email, token_verification);
                                res.sendStatus(200);
                            }
                        });
                    } else res.sendStatus(500); //Supplied email not valid
                }
            }
        });
    } else res.sendStatus(403); //Not all information provided

});

/*
Functions for resolving or converting user data
 */

function getUserID(email){
    return new Promise((resolve,reject) => {
        MySQL.query('SELECT id FROM patient WHERE email=?', email, async (err, rows) => {
            if(err){
                reject(0);
            } else {
                resolve(rows[0].id);
            }
        });
    })

}


module.exports = { router, getUserID};