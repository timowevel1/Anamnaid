const mySQL = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'anamnaid'
};

const connection = mySQL.createConnection(config);

module.exports = connection;
