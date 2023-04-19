const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 20,
    host: process.env.DB_HOST,
    user:   process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});


module.exports = pool;
// const pool = mysql.createPool({
//     connectionLimit : 20,
//     host: '52.32.208.197',
//     user:   'pepito',
//     password: 'pepito',
//     database: 'mtt',
// });

