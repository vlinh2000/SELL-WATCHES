const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_loaisanphams: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM LOAI_SAN_PHAM ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const loaisanphams = await executeQuery(sql);

            const sql_count = `SELECT COUNT(MA_LOAI_SP) as total FROM LOAI_SAN_PHAM`;
            const data = await executeQuery(sql_count);

            res.json({
                result: loaisanphams,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_loaisanpham: async (req, res) => {
        try {
            const { loaisanphamID } = req.params;
            const sql = `SELECT * FROM LOAI_SAN_PHAM WHERE MA_LOAI_SP='${loaisanphamID}'`;
            const loaisanphams = await executeQuery(sql);
            res.json({
                result: loaisanphams[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_loaisanphams: async (req, res) => {
        try {
            const { TEN_LOAI_SP } = req.body;
            const MA_LOAI_SP = 'SP_' + randomString();

            const sql = `INSERT INTO LOAI_SAN_PHAM(MA_LOAI_SP,TEN_LOAI_SP) 
                                        VALUES ('${MA_LOAI_SP}','${TEN_LOAI_SP}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm loại sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_loaisanphams: async (req, res) => {
        try {
            const { loaisanphamID } = req.params;
            const isExist = await checkIsExist('LOAI_SAN_PHAM', 'MA_LOAI_SP', loaisanphamID);
            if (!isExist) return res.status(400).json({ message: "Loại sản phẩm không tồn tại." });

            const sql = `UPDATE LOAI_SAN_PHAM SET ? WHERE MA_LOAI_SP='${loaisanphamID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật loại sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_loaisanphams: async (req, res) => {
        try {
            const { loaisanphamID } = req.params;
            const isExist = await checkIsExist('LOAI_SAN_PHAM', 'MA_LOAI_SP', loaisanphamID);
            if (!isExist) return res.status(400).json({ message: "Loại sản phẩm không tồn tại." });

            const sql = `DELETE FROM LOAI_SAN_PHAM WHERE MA_LOAI_SP='${loaisanphamID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa loại sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}