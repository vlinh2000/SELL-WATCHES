const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_uudais: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM UU_DAI ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const uudais = await executeQuery(sql);
            const sql_count = `SELECT COUNT(MA_UU_DAI) as total FROM UU_DAI`;
            const data = await executeQuery(sql_count);

            res.json({
                result: uudais,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_uudai: async (req, res) => {
        try {
            const { uudaiID } = req.params;
            const sql = `SELECT * FROM UU_DAI  WHERE MA_UU_DAI='${uudaiID}'`;
            const uudais = await executeQuery(sql);
            res.json({
                result: uudais[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_uudais: async (req, res) => {
        try {
            const { TEN_UU_DAI, SO_LUONG_BAN_DAU, SO_LUONG_CON_LAI, HSD, MPVC, GIA_TRI, DON_VI_GIAM } = req.body;
            const MA_UU_DAI = 'UD_' + randomString();
            const sql = `INSERT INTO UU_DAI(MA_UU_DAI,TEN_UU_DAI,SO_LUONG_BAN_DAU,SO_LUONG_CON_LAI,HSD,GIA_TRI,MPVC,DON_VI_GIAM) 
                                        VALUES ('${MA_UU_DAI}','${TEN_UU_DAI}',${SO_LUONG_BAN_DAU},${SO_LUONG_CON_LAI},'${HSD}',${GIA_TRI || 0},${MPVC},'${DON_VI_GIAM || ""}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm voucher thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_uudais: async (req, res) => {
        try {
            const { uudaiID } = req.params;
            const { TEN_UU_DAI, SO_LUONG_BAN_DAU, SO_LUONG_CON_LAI, HSD, MPVC, GIA_TRI, DON_VI_GIAM } = req.body;

            const isExist = await checkIsExist('UU_DAI', 'MA_UU_DAI', uudaiID);
            if (!isExist) return res.status(400).json({ message: "Voucher không tồn tại." });

            const data = { TEN_UU_DAI, SO_LUONG_BAN_DAU, SO_LUONG_CON_LAI, HSD, MPVC, GIA_TRI, DON_VI_GIAM }
            const sql = `UPDATE UU_DAI SET ? WHERE MA_UU_DAI='${uudaiID}'`;
            console.log({ sql, data })
            await executeUpdateQuery(sql, data);

            res.json({ message: 'Cập nhật ưu đãi thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_uudais: async (req, res) => {
        try {
            const { uudaiID } = req.params;
            const isExist = await checkIsExist('UU_DAI', 'MA_UU_DAI', uudaiID);
            if (!isExist) return res.status(400).json({ message: "Voucher không tồn tại." });

            const sql = `DELETE FROM UU_DAI WHERE MA_UU_DAI='${uudaiID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa voucher thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}