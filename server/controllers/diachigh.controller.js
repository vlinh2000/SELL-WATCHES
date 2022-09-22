const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_diachighs: async (req, res) => {
        try {
            const { USER_ID } = req.user.data;
            const sql = `SELECT * FROM DIA_CHI_GH WHERE USER_ID='${USER_ID}'`;
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
            let { DIA_CHI } = req.body;
            const { USER_ID } = req.user.data;
            DIA_CHI = JSON.parse(DIA_CHI);
            if (!Array.isArray(DIA_CHI)) { DIA_CHI = [DIA_CHI] };

            const processes = DIA_CHI.map((dc) => {
                console.log({ dc });
                return new Promise(async (resolve, reject) => {
                    try {
                        if (dc.MA_DC) {
                            const sql = `UPDATE DIA_CHI_GH SET ? WHERE MA_DC='${dc.MA_DC}'`;
                            await executeUpdateQuery(sql, { DIA_CHI: dc.DIA_CHI });
                        } else {
                            const MA_DC = 'DCGH_' + randomString();
                            const sql = `INSERT INTO DIA_CHI_GH(MA_DC,USER_ID,DIA_CHI) 
                                               VALUES ('${MA_DC}','${USER_ID}','${dc.DIA_CHI}')`;
                            await executeQuery(sql);
                        }
                        resolve(true);
                    } catch (error) {
                        reject(false);
                    }
                })
            })
            await Promise.all(processes);
            res.json({ message: 'Cập nhật địa chỉ giao hàng thành công.' });
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