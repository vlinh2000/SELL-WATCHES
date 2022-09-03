const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_chucvus: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM CHUC_VU ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const chucvus = await executeQuery(sql);

            const sql_count = `SELECT COUNT(MA_CV) as total FROM CHUC_VU`;
            const data = await executeQuery(sql_count);

            res.json({
                result: chucvus,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_chucvu: async (req, res) => {
        try {
            const { chucvuID } = req.params;
            const sql = `SELECT * FROM CHUC_VU WHERE MA_CV = '${chucvuID}'`;
            const chucvus = await executeQuery(sql);
            res.json({
                result: chucvus[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_chucvus: async (req, res) => {
        try {
            const { TEN_CV, LUONG_CO_BAN } = req.body;
            const MA_CV = randomString();

            const sql = `INSERT INTO CHUC_VU(MA_CV, TEN_CV, LUONG_CO_BAN)
            VALUES('${MA_CV}', '${TEN_CV}', '${LUONG_CO_BAN}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm chức vụ thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_chucvus: async (req, res) => {
        try {
            const { chucvuID } = req.params;
            const isExist = await checkIsExist('CHUC_VU', 'MA_CV', chucvuID);
            if (!isExist) return res.status(400).json({ message: "Chức vụ không tồn tại." });

            const sql = `UPDATE CHUC_VU SET ? WHERE MA_CV = '${chucvuID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật chức vụ thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_chucvus: async (req, res) => {
        try {
            const { chucvuID } = req.params;
            const isExist = await checkIsExist('CHUC_VU', 'MA_CV', chucvuID);
            if (!isExist) return res.status(400).json({ message: "Chức vụ không tồn tại." });

            const sql = `DELETE FROM CHUC_VU WHERE MA_CV = '${chucvuID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa chức vụ thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}