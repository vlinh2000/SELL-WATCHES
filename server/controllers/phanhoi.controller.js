const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_phanhois: async (req, res) => {
        try {
            const sql = `SELECT * FROM PHAN_HOI`;
            const phanhois = await executeQuery(sql);
            res.json({
                result: phanhois,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_phanhoi: async (req, res) => {
        try {
            const { phanhoiID } = req.params;
            const sql = `SELECT * FROM PHAN_HOI WHERE MA_PH='${phanhoiID}'`;
            const phanhois = await executeQuery(sql);
            res.json({
                result: phanhois[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_phanhois: async (req, res) => {
        try {
            const { MA_DG, NV_ID, NOI_DUNG } = req.body;
            const MA_PH = randomString();

            const sql = `INSERT INTO PHAN_HOI(MA_PH,MA_DG, NV_ID, NOI_DUNG) 
                                        VALUES ('${MA_PH}','${MA_DG}','${NV_ID}','${NOI_DUNG}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm phản hồi thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_phanhois: async (req, res) => {
        try {
            const { phanhoiID } = req.params;
            const isExist = await checkIsExist('PHAN_HOI', 'MA_PH', phanhoiID);
            if (!isExist) return res.status(400).json({ message: "phản hồi không tồn tại." });

            req.body.CAP_NHAT = getNow();
            const sql = `UPDATE PHAN_HOI SET ? WHERE MA_PH='${phanhoiID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật phản hồi thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_phanhois: async (req, res) => {
        try {
            const { phanhoiID } = req.params;
            const isExist = await checkIsExist('PHAN_HOI', 'MA_PH', phanhoiID);
            if (!isExist) return res.status(400).json({ message: "phản hồi không tồn tại." });

            const sql = `DELETE FROM PHAN_HOI WHERE MA_PH='${phanhoiID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa phản hồi thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}