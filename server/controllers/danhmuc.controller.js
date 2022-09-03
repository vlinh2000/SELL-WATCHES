const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_danhmucs: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM DANH_MUC a , LOAI_SAN_PHAM b  WHERE a.MA_LOAI_SP = b.MA_LOAI_SP ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const danhmucs = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_DANH_MUC) as total FROM DANH_MUC a , LOAI_SAN_PHAM b WHERE a.MA_LOAI_SP = b.MA_LOAI_SP`;
            const data = await executeQuery(sql_count);

            res.json({
                result: danhmucs,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_danhmuc: async (req, res) => {
        try {
            const { danhmucID } = req.params;
            const sql = `SELECT * FROM DANH_MUC WHERE MA_DANH_MUC='${danhmucID}'`;
            const danhmucs = await executeQuery(sql);
            res.json({
                result: danhmucs[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_danhmucs: async (req, res) => {
        try {
            const { MA_LOAI_SP, TEN_DANH_MUC } = req.body;
            const MA_DANH_MUC = 'DM_' + randomString();
            const sql = `INSERT INTO DANH_MUC(MA_DANH_MUC,MA_LOAI_SP,TEN_DANH_MUC) 
                                        VALUES ('${MA_DANH_MUC}','${MA_LOAI_SP}','${TEN_DANH_MUC}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm danh mục thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_danhmucs: async (req, res) => {
        try {
            const { danhmucID } = req.params;
            const isExist = await checkIsExist('DANH_MUC', 'MA_DANH_MUC', danhmucID);
            if (!isExist) return res.status(400).json({ message: "Danh mục không tồn tại." });

            const data = { MA_LOAI_SP: req.body.MA_LOAI_SP, TEN_DANH_MUC: req.body.TEN_DANH_MUC }
            const sql = `UPDATE DANH_MUC SET ? WHERE MA_DANH_MUC='${danhmucID}'`;
            await executeUpdateQuery(sql, { ...data });

            res.json({ message: 'Cập nhật danh mục thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_danhmucs: async (req, res) => {
        try {
            const { danhmucID } = req.params;
            const isExist = await checkIsExist('DANH_MUC', 'MA_DANH_MUC', danhmucID);
            if (!isExist) return res.status(400).json({ message: "Danh mục không tồn tại." });

            const sql = `DELETE FROM DANH_MUC WHERE MA_DANH_MUC='${danhmucID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa danh mục thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}