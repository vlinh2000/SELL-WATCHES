const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_phanhois: async (req, res) => {
        try {
            const { MA_DG } = req.query;
            const sql = `SELECT a.MA_DG,a.MA_PH,a.NOI_DUNG,a.NGAY_TAO,a.PHAN_HOI_TOI,b.ANH_DAI_DIEN as NV_ANH_DAI_DIEN , b.HO_TEN as NV_HO_TEN,c.ANH_DAI_DIEN , c.HO_TEN
                         FROM PHAN_HOI a
                         LEFT JOIN NHAN_VIEN b ON a.NV_ID=b.NV_ID
                         LEFT JOIN USER c ON a.USER_ID=c.USER_ID
                         WHERE a.MA_DG='${MA_DG}'
                         ORDER BY a.NGAY_TAO ASC`;
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
            const { MA_DG, NOI_DUNG, PHAN_HOI_TOI } = req.body;
            const { NV_ID, USER_ID } = req.user.data;
            const MA_PH = 'PH_' + randomString();

            let sql = '';
            if (NV_ID) {
                sql = `INSERT INTO PHAN_HOI(MA_PH,MA_DG, NV_ID, NOI_DUNG,PHAN_HOI_TOI) 
                                            VALUES ('${MA_PH}','${MA_DG}','${NV_ID}','${NOI_DUNG}','${PHAN_HOI_TOI || ''}')`;
            } else {
                sql = `INSERT INTO PHAN_HOI(MA_PH,MA_DG, NOI_DUNG,USER_ID,PHAN_HOI_TOI) 
                                                                       VALUES ('${MA_PH}','${MA_DG}','${NOI_DUNG}','${USER_ID}','${PHAN_HOI_TOI || ''}')`;
            }
            console.log(sql);
            await executeQuery(sql);
            res.json({ message: 'Gửi phản hồi thành công.' });
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