import cryptoJs from 'crypto-js';
import axios from 'axios';
import { Buffer } from 'buffer';

export const handleMomoPayment = async data => {
    try {

        //parameters
        var partnerCode = "MOMO";
        var accessKey = process.env.REACT_APP_MOMO_ACCESS_KEY;
        var secretkey = process.env.REACT_APP_MOMO_SECRET_KEY;
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "Thanh toán với momo";
        var redirectUrl = "https://www.google.com";
        var ipnUrl = "https://callback.url/notify";
        var amount = data.TONG_TIEN + data.PHI_SHIP - data.GIAM_GIA;
        var requestType = "captureWallet"
        var extraData = "";
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType

        var signature = cryptoJs.SHA256(rawSignature, secretkey).toString();
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
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });

        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }//Send the request and get the response

    } catch (error) {
        console.log(error)
    }
}