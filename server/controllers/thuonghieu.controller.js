const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_thuonghieus: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM THUONG_HIEU ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const thuonghieus = await executeQuery(sql);
            const sql_count = `SELECT COUNT(MA_THUONG_HIEU) as total FROM THUONG_HIEU`;
            const data = await executeQuery(sql_count);

            res.json({
                result: thuonghieus,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_thuonghieu: async (req, res) => {
        try {
            const { thuonghieuID } = req.params;
            const sql = `SELECT * FROM THUONG_HIEU WHERE MA_THUONG_HIEU='${thuonghieuID}'`;
            const thuonghieus = await executeQuery(sql);
            res.json({
                result: thuonghieus[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_thuonghieus: async (req, res) => {
        try {
            const { TEN_THUONG_HIEU, QUOC_GIA, NAM_THANH_LAP } = req.body;
            const MA_THUONG_HIEU = 'TH_' + randomString();

            const sql = `INSERT INTO THUONG_HIEU(MA_THUONG_HIEU,TEN_THUONG_HIEU,QUOC_GIA,NAM_THANH_LAP) 
                                        VALUES ('${MA_THUONG_HIEU}','${TEN_THUONG_HIEU}','${QUOC_GIA}','${NAM_THANH_LAP}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm thương hiệu thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_thuonghieus: async (req, res) => {
        try {
            const { thuonghieuID } = req.params;
            const isExist = await checkIsExist('THUONG_HIEU', 'MA_THUONG_HIEU', thuonghieuID);
            if (!isExist) return res.status(400).json({ message: "Thương hiệu không tồn tại." });

            const sql = `UPDATE THUONG_HIEU SET ? WHERE MA_THUONG_HIEU='${thuonghieuID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật thương hiệu thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_thuonghieus: async (req, res) => {
        try {
            const { thuonghieuID } = req.params;
            const isExist = await checkIsExist('THUONG_HIEU', 'MA_THUONG_HIEU', thuonghieuID);
            if (!isExist) return res.status(400).json({ message: "Thương hiệu không tồn tại." });

            const sql = `DELETE FROM THUONG_HIEU WHERE MA_THUONG_HIEU='${thuonghieuID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa thương hiệu thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}