var jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/global');

module.exports = {
    isAuth: async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            verifyToken(token).then(data => {
                req.user = data;
                next();
            }).catch(err => {
                console.log({ err })
                return res.status(400).json({ message: "Token hết hạn." })
            });
        }
        else return res.status(400).json({ message: "Vui lòng đăng nhập." })
    }
}