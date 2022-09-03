const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_nhacungcaps: async (req, res) => {
        try {

            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM NHA_CUNG_CAP ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const nhacungcaps = await executeQuery(sql);

            const sql_count = `SELECT COUNT(MA_NCC) as total FROM NHA_CUNG_CAP`;
            const data = await executeQuery(sql_count);

            res.json({
                result: nhacungcaps,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_nhacungcap: async (req, res) => {
        try {
            const { nhacungcapID } = req.params;
            const sql = `SELECT * FROM NHA_CUNG_CAP WHERE MA_NCC='${nhacungcapID}'`;
            const nhacungcaps = await executeQuery(sql);
            res.json({
                result: nhacungcaps[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_nhacungcaps: async (req, res) => {
        try {
            const { TEN_NCC, DIA_CHI, SO_DIEN_THOAI } = req.body;
            const MA_NCC = 'NCC_' + randomString();

            const sql = `INSERT INTO NHA_CUNG_CAP(MA_NCC,TEN_NCC, DIA_CHI,SO_DIEN_THOAI) 
                                        VALUES ('${MA_NCC}','${TEN_NCC}','${DIA_CHI}','${SO_DIEN_THOAI}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm nhà cung cấp thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_nhacungcaps: async (req, res) => {
        try {
            const { nhacungcapID } = req.params;
            const isExist = await checkIsExist('NHA_CUNG_CAP', 'MA_NCC', nhacungcapID);
            if (!isExist) return res.status(400).json({ message: "nhà cung cấp không tồn tại." });

            const sql = `UPDATE NHA_CUNG_CAP SET ? WHERE MA_NCC='${nhacungcapID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật nhà cung cấp thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_nhacungcaps: async (req, res) => {
        try {
            const { nhacungcapID } = req.params;
            const isExist = await checkIsExist('NHA_CUNG_CAP', 'MA_NCC', nhacungcapID);
            if (!isExist) return res.status(400).json({ message: "nhà cung cấp không tồn tại." });

            const sql = `DELETE FROM NHA_CUNG_CAP WHERE MA_NCC='${nhacungcapID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa nhà cung cấp thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}