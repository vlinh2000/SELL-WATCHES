const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_diachighs: async (req, res) => {
        try {
            const sql = `SELECT * FROM DIA_CHI_GH`;
            const diachighs = await executeQuery(sql);
            res.json({
                result: diachighs,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_diachigh: async (req, res) => {
        try {
            const { diachighID } = req.params;
            const sql = `SELECT * FROM DIA_CHI_GH WHERE MA_DC='${diachighID}'`;
            const diachighs = await executeQuery(sql);
            res.json({
                result: diachighs[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_diachighs: async (req, res) => {
        try {
            const { USER_ID, DIA_CHI } = req.body;
            const MA_DC = randomString();

            const sql = `INSERT INTO DIA_CHI_GH(MA_DC,USER_ID,DIA_CHI) 
                                        VALUES ('${MA_DC}','${USER_ID}','${DIA_CHI}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm địa chỉ giao hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_diachighs: async (req, res) => {
        try {
            const { diachighID } = req.params;
            const isExist = await checkIsExist('DIA_CHI_GH', 'MA_DC', diachighID);
            if (!isExist) return res.status(400).json({ message: "Địa chỉ giao hàng không tồn tại." });

            const sql = `UPDATE DIA_CHI_GH SET ? WHERE MA_DC='${diachighID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật địa chỉ giao hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_diachighs: async (req, res) => {
        try {
            const { diachighID } = req.params;
            const isExist = await checkIsExist('DIA_CHI_GH', 'MA_DC', diachighID);
            if (!isExist) return res.status(400).json({ message: "Địa chỉ giao hàng không tồn tại." });

            const sql = `DELETE FROM DIA_CHI_GH WHERE MA_DC='${diachighID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa địa chỉ giao hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}