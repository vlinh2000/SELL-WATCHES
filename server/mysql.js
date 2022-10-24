var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3308,
    database: "quan_ly_ban_hang"
});

// var con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     database: process.env.DB_DATABASE
// });

function executeQuery(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, results) {
            if (err) reject(err);
            resolve(results);
        })
    })
}

function executeUpdateQuery(sql, data) {
    return new Promise((resolve, reject) => {
        con.query(sql, data, function (err) {
            if (err) reject(err);
            resolve(true);
        })
    })
}

function checkIsExist(table, fieldName, id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ${table} WHERE ${fieldName}='${id}'`;
        con.query(sql, function (err, results) {
            if (err) reject(err);
            resolve(results?.length > 0 ? true : false);
        })
    })
}

module.exports = { con, executeQuery, executeUpdateQuery, checkIsExist };

