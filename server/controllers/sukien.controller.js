const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_sukiens: async (req, res) => {
        try {
            const { _limit, _page, action } = req.query;
            const d = new Date();
            const sql = `SELECT * 
                        FROM SU_KIEN
                        WHERE 1=1
                        ${action === 'nearest' ? ` AND TG_KET_THUC >= '${d.toJSON().slice(0, 10)} ${d.toLocaleTimeString('en-GB')}' ` : ''}
                        ORDER BY ${action === 'nearest' ? 'TG_BAT_DAU ASC' : 'NGAY_TAO DESC'} ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;

            console.log({ sql })
            let sukiens = await executeQuery(sql);
            const sql_count = `SELECT COUNT(MA_SK) as total FROM SU_KIEN`;
            const data = await executeQuery(sql_count);

            const processes = sukiens.map((sk, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql = `SELECT MA_UU_DAI FROM SU_KIEN_UU_DAI WHERE MA_SK='${sk.MA_SK}' `
                        const mauudais = await executeQuery(sql);
                        sukiens[idx].VOUCHERS = mauudais;
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            action !== 'nearest' && await Promise.all(processes);

            res.json({
                result: sukiens,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_sukien: async (req, res) => {
        try {
            const { sukienID } = req.params;
            const sql = `SELECT * FROM SU_KIEN  WHERE MA_SU_KIEN='${sukienID}'`;
            const sukiens = await executeQuery(sql);
            res.json({
                result: sukiens[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_sukiens: async (req, res) => {
        try {
            const { TEN_SK, TG_BAT_DAU, TG_KET_THUC, KHUNG_GIO_TU, KHUNG_GIO_DEN, VOUCHERS } = req.body;
            console.log(req.body);
            const MA_SK = 'SK_' + randomString();
            const sql = `INSERT INTO SU_KIEN(MA_SK,TEN_SK, TG_BAT_DAU, TG_KET_THUC, KHUNG_GIO_TU, KHUNG_GIO_DEN) 
                                        VALUES ('${MA_SK}','${TEN_SK}','${TG_BAT_DAU}','${TG_KET_THUC}','${KHUNG_GIO_TU}','${KHUNG_GIO_DEN}')`;
            await executeQuery(sql);
            // insert voucher to sukien_uudai
            const processes = VOUCHERS.map(MA_UU_DAI => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql = `INSERT INTO SU_KIEN_UU_DAI(MA_SK,MA_UU_DAI) VALUES('${MA_SK}','${MA_UU_DAI}')`
                        await executeQuery(sql);
                        resolve(true);
                        console.log({ status: 'Done: ' + MA_UU_DAI })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            await Promise.all(processes);
            res.json({ message: 'Tạo sự kiện thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_sukiens: async (req, res) => {
        try {
            const { sukienID } = req.params;
            const { TEN_SK, TG_BAT_DAU, TG_KET_THUC, KHUNG_GIO_TU, KHUNG_GIO_DEN, VOUCHERS } = req.body;

            const isExist = await checkIsExist('SU_KIEN', 'MA_SK', sukienID);
            if (!isExist) return res.status(400).json({ message: "Sự kiện không tồn tại." });

            const data = { TEN_SK, TG_BAT_DAU, TG_KET_THUC, KHUNG_GIO_TU, KHUNG_GIO_DEN }
            const sql = `UPDATE SU_KIEN SET ? WHERE MA_SK='${sukienID}'`;
            await executeUpdateQuery(sql, data);

            const sql_clean = `DELETE FROM SU_KIEN_UU_DAI WHERE MA_SK='${sukienID}'`;
            await executeQuery(sql_clean);

            const processes = VOUCHERS.map(MA_UU_DAI => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql = `INSERT INTO SU_KIEN_UU_DAI(MA_SK,MA_UU_DAI) VALUES('${sukienID}','${MA_UU_DAI}')`
                        await executeQuery(sql);
                        resolve(true);
                        console.log({ status: 'Done: ' + MA_UU_DAI })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            await Promise.all(processes);
            res.json({ message: 'Cập nhật sự kiện thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_sukiens: async (req, res) => {
        try {
            const { sukienID } = req.params;
            const isExist = await checkIsExist('SU_KIEN', 'MA_SK', sukienID);
            if (!isExist) return res.status(400).json({ message: "Voucher không tồn tại." });

            const sql = `DELETE FROM SU_KIEN WHERE MA_SK='${sukienID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa sự kiện thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}