const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_thongkes: async (req, res) => {
        try {
            // total orders
            let result = {};

            const sqls = [
                { sql: 'SELECT COUNT(MA_DH) as total FROM DON_HANG', saveTo: 'TONG_DH' },
                { sql: 'SELECT SUM(TONG_TIEN) as total FROM DON_HANG', saveTo: 'TONG_DOANH_THU' },
                { sql: 'SELECT COUNT(USER_ID) as total FROM USER', saveTo: 'TONG_USER' },
                { sql: 'SELECT TG_DAT_HANG,HO_TEN_NGUOI_DAT,TONG_TIEN FROM quan_ly_dat_hang.don_hang ORDER BY TG_DAT_HANG DESC', saveTo: 'DON_HANG_MOI_NHAT' },
                {
                    sql: `SELECT b.MA_SP,c.TEN_SP,c.MO_TA,d.HINH_ANH,SUM(b.SO_LUONG) as DA_BAN 
                        FROM DON_HANG a, CHI_TIET_DON_HANG b, SAN_PHAM c, ANH_SAN_PHAM d 
                        WHERE 
                            MONTH(a.TG_DAT_HANG) = '${new Date().getMonth() + 1}'
                            AND a.MA_DH = b.MA_DH 
                            AND ( a.TRANG_THAI = 2 OR a.DA_THANH_TOAN = '1') 
                            AND b.MA_SP = c.MA_SP 
                            AND d.MA_SP = c.MA_SP 
                        GROUP BY b.MA_SP
                        LIMIT 4`, saveTo: 'TOP_SP_BAN_CHAY'
                },
            ]
            // save img to database
            const processes = sqls.map(item => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const data = await executeQuery(item.sql);
                        result[item.saveTo] = data;
                        resolve(true);
                        console.log({ status: 'Done: ' + item.saveTo })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });
            console.log("Pending ...")
            await Promise.all(processes);
            console.log("Get done.")
            console.log({ result });

            res.json({
                result: {
                    TONG_DH: result.TONG_DH[0].total,
                    TONG_DOANH_THU: result.TONG_DOANH_THU[0].total,
                    TONG_USER: result.TONG_USER[0].total,
                    TOP_SP_BAN_CHAY: result.TOP_SP_BAN_CHAY,
                    DON_HANG_MOI_NHAT: result.DON_HANG_MOI_NHAT
                },
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    }
}