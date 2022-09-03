const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_danhgias: async (req, res) => {
        try {
            const sql = `SELECT * FROM DANH_GIA`;
            const danhgias = await executeQuery(sql);
            res.json({
                result: danhgias,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_danhgia: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const sql = `SELECT * FROM DANH_GIA WHERE MA_DG='${danhgiaID}'`;
            const danhgias = await executeQuery(sql);
            res.json({
                result: danhgias[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_danhgias: async (req, res) => {
        try {
            const { USER_ID, MA_SP, NOI_DUNG, SO_SAO } = req.body;
            const MA_DG = randomString();

            const sql = `INSERT INTO DANH_GIA(MA_DG, USER_ID, MA_SP, NOI_DUNG, SO_SAO) 
                                        VALUES ('${MA_DG}','${USER_ID}','${MA_SP}','${NOI_DUNG}','${SO_SAO}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm đánh giá thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_danhgias: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const isExist = await checkIsExist('DANH_GIA', 'MA_DG', danhgiaID);
            if (!isExist) return res.status(400).json({ message: "Đánh giá không tồn tại." });

            const sql = `UPDATE DANH_GIA SET ? WHERE MA_DG='${danhgiaID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật đánh giá thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_danhgias: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const isExist = await checkIsExist('DANH_GIA', 'MA_DG', danhgiaID);
            if (!isExist) return res.status(400).json({ message: "Đánh giá không tồn tại." });

            const sql = `DELETE FROM DANH_GIA WHERE MA_DG='${danhgiaID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa đánh giá thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}