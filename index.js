require("dotenv").config();
const app = require('./src/Routes');

app.listen(process.env.PORT, () => {
    console.log(`Anamnaid Backend listening at http://localhost:${process.env.PORT}`);
});

module.exports.PORT = process.env.PORT;
