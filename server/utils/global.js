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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

function generateToken(data, expire = (60 * 60 * 24 * 365)) {
    console.log({ expire })
    return new Promise((resolve, reject) => {
        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + expire, // 365 days
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

async function handleMomoPayment(data) {
    //parameters
    var partnerCode = "MOMO";
    var accessKey = process.env.MOMO_ACCESS_KEY;
    var secretkey = process.env.MOMO_SECRET_KEY;
    var requestId = partnerCode + new Date().getTime();
    var orderId = 'DH_' + randomString();
    var orderInfo = "Thanh toán với Momo";
    var redirectUrl = "http://localhost:3000?redirect=payments";
    var ipnUrl = "http://localhost:8000/api/donhangs";
    var amount = data.TONG_TIEN + data.PHI_SHIP - data.GIAM_GIA;
    // var requestType = "captureWallet"
    // var requestType = "payWithATM"
    var requestType = "payWithMethod"
    var extraData = Buffer.from(JSON.stringify({ ...data, orderId })).toString('base64');
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    // var items = data.items;
    // var userInfo = {
    //     name: data.HO_TEN_NGUOI_DAT,
    //     phoneNumber: data.SDT_NGUOI_DAT,
    //     email: data.EMAIL_NGUOI_DAT
    // }

    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        // items: items,
        // userInfo: userInfo,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    });
    //Create the HTTPS objects
    console.log({ requestBody })
    const axios = require('axios');
    const axiosInstance = axios.create({
        baseURL: 'https://test-payment.momo.vn',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    })
    const response = await axiosInstance.post('/v2/gateway/api/create', requestBody)
    return response.data;
}

module.exports = { randomString, getNow, hashString, compareString, generateToken, generateRefreshToken, verifyToken, handleMomoPayment, numberWithCommas }