const express = require('express');
const app = express();
const Patient = require('./routes/Patient').router;
const Doctor = require('./routes/Doctor').router;
const Anamnesia = require('./routes/Anamnesia').router;
const VerifyAccount = require('./routes/Verify').router;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/patient', Patient);
app.use('/doctor', Doctor);
app.use('/anamnesia', Anamnesia);
app.use('/verify', VerifyAccount);



module.exports = app;