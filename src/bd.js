const mysql = require('mysql');
// const pool = mysql.createPool({
//     connectionLimit : 20,
//     host: '52.32.208.197',
//     user:   'pepito',
//     password: 'pepito',
//     database: 'mtt',
// });

const pool = mysql.createPool({
    connectionLimit : 20,
    host: 'localhost',
    user:   'root',
    password: '',
    database: 'mtt',
});

module.exports = pool;
