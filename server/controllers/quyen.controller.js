const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");

module.exports = {
    get_quyens: async (req, res) => {
        try {
            const sql = `SELECT * FROM QUYEN`;
            const quyens = await executeQuery(sql);
            res.json({
                result: quyens,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_quyen: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const sql = `SELECT * FROM QUYEN WHERE MA_QUYEN='${quyenID}'`;
            const quyens = await executeQuery(sql);
            res.json({
                result: quyens[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_quyens: async (req, res) => {
        try {
            const { MA_QUYEN, TEN_QUYEN } = req.body;

            const sql = `INSERT INTO QUYEN(MA_QUYEN,TEN_QUYEN) 
                                        VALUES ('${MA_QUYEN}','${TEN_QUYEN}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_quyens: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const isExist = await checkIsExist('QUYEN', 'MA_QUYEN', quyenID);
            if (!isExist) return res.status(400).json({ message: "Quyền không tồn tại." });

            const sql = `UPDATE QUYEN SET ? WHERE MA_QUYEN='${quyenID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_quyens: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const isExist = await checkIsExist('QUYEN', 'MA_QUYEN', quyenID);
            if (!isExist) return res.status(400).json({ message: "Quyền không tồn tại." });

            const sql = `DELETE FROM QUYEN WHERE MA_QUYEN='${quyenID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}