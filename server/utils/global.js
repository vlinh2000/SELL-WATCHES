let generator = require('string-generator-js');
const options = { length: 5 }
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config();

function randomString() {
    return generator.generate(options);
}

function getNow() {
    const d = new Date();

    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

function hashString(string) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(string, 10, async (error, result) => {
            if (error) reject(error);
            resolve(result);
        });

    })
}

function compareString(string, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hash, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });

    })
}

function generateToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365), // 365 minutes
            data
        }, process.env.PRIVATE_KEY_TOKEN, function (error, token) {
            if (error) reject(error);
            resolve(token);
        });

    })

}

function generateRefreshToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 400),// 400 days
            data
        }, process.env.PRIVATE_KEY_TOKEN, function (error, token) {
            if (error) reject(error);
            resolve(token);
        });

    })

}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.PRIVATE_KEY_TOKEN, (err, decoded) => {
            if (err) {
                // const { uid, name, picture } = await admin.auth().verifyIdToken(accessToken);
                // req.user = { id: uid, name, avatar: picture, key: 1 };
                // next();
                // return;
                reject(err);
            }
            resolve(decoded);
        })
    })

}

module.exports = { randomString, getNow, hashString, compareString, generateToken, generateRefreshToken, verifyToken }