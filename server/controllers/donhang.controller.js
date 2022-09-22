const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_donhangs: async (req, res) => {
        try {
            const { _limit, _page, status, action, MA_SP } = req.query;
            const user = req.user?.data;

            if (action === 'check_had_order') {
                const sql = `SELECT COUNT(a.MA_DH) as total
                             FROM DON_HANG a, CHI_TIET_SAN_PHAM b 
                             WHERE a.USER_ID='${user?.USER_ID}' AND a.MA_DH=b.MA_DH AND b.MA_SP='${MA_SP}'`;
                let data = await executeQuery(sql);
                return res.json({
                    // result: data,
                    available: data[0].total > 0 ? true : false,
                    message: 'Thành công'
                });
            }

            const sql = `SELECT a.MA_DH,a.HO_TEN_NGUOI_DAT,a.SDT_NGUOI_DAT,a.NV_ID,a.DON_VI_VAN_CHUYEN, b.HO_TEN, a.USER_ID, a.TG_DAT_HANG, a.TG_GIAO_HANG, a.DIA_CHI, a.GIAM_GIA, a.TONG_TIEN, a.TRANG_THAI, a.DA_THANH_TOAN, a.HINH_THUC_THANH_TOAN, a.PHI_SHIP, a.GHI_CHU, a.NGAY_TAO  
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${status ? 'AND a.TRANG_THAI=' + status : ''} 
                        ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            let donhangs = await executeQuery(sql);

            const sql_count = `SELECT COUNT(a.MA_DH) as total 
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${status ? 'AND a.TRANG_THAI=' + status : ''} `;
            const data = await executeQuery(sql_count);

            // get detail (CHI_TIET_DON_HANG)
            const processes = donhangs?.map((dh, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_detail = `SELECT a.MA_DH, a.SO_LUONG, a.DON_GIA, a.GIA,b.MA_SP, b.TEN_SP, c.HINH_ANH
                                            FROM CHI_TIET_DON_HANG a , SAN_PHAM b 
                                            LEFT JOIN ANH_SAN_PHAM c ON b.MA_SP= c.MA_SP 
                                            WHERE a.MA_SP = b.MA_SP AND a.MA_DH='${dh.MA_DH}'`;
                        donhangs[idx].SAN_PHAM = await executeQuery(sql_detail);
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            await Promise.all(processes);
            res.json({
                result: donhangs,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_donhang: async (req, res) => {
        try {
            const { donhangID } = req.params;
            const sql = `SELECT * FROM DON_HANG a, CHI_TIET_DON_HANG b WHERE a.MA_DH = b.MA_DH AND MA_DH='${donhangID}'`;
            const donhangs = await executeQuery(sql);
            res.json({
                result: donhangs[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_thongkes: async (req, res) => {
        try {
            const { dateFrom, dateTo } = req.query;
            const sql = `SELECT  DATE_FORMAT(a.TG_DAT_HANG,'%Y-%m') as THANG, SUM(a.TONG_TIEN) as TONG_TIEN 
                        FROM DON_HANG a
                        WHERE 
                            a.TG_DAT_HANG between '${dateFrom}' AND '${dateTo}' 
                            AND ( a.TRANG_THAI = 2 OR a.DA_THANH_TOAN = '1') 
                        GROUP BY MONTH(a.TG_DAT_HANG)`;
            const donhangs = await executeQuery(sql);
            res.json({
                result: donhangs,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_donhangs: async (req, res) => {
        try {
            const { USER_ID, DIA_CHI_GH, GIAM_GIA, TONG_TIEN, DA_THANH_TOAN, HINH_THUC_THANH_TOAN, PHI_SHIP, GHI_CHU } = req.body;
            const { MA_SP, SO_LUONG, DON_GIA } = req.body;

            const MA_DH = 'DH_' + randomString();
            const sql = `INSERT INTO DON_HANG(MA_DH,USER_ID, DIA_CHI_GH, GIAM_GIA, TONG_TIEN, DA_THANH_TOAN, HINH_THUC_THANH_TOAN, PHI_SHIP, GHI_CHU) 
                                        VALUES ('${MA_DH}','${USER_ID}','${DIA_CHI_GH}','${GIAM_GIA}','${TONG_TIEN}','${DA_THANH_TOAN}','${HINH_THUC_THANH_TOAN}','${PHI_SHIP}','${GHI_CHU}')`;
            await executeQuery(sql);

            // loop here
            const sqlDetail = `INSERT INTO CHI_TIET_DON_HANG(MA_DH,MA_SP, SO_LUONG, DON_GIA) 
                                                    VALUES ('${MA_DH}','${MA_SP}','${SO_LUONG}','${DON_GIA}')`;
            //
            await executeQuery(sql);
            await executeQuery(sqlDetail);
            res.json({ message: 'Thêm đơn hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_donhangs: async (req, res) => {
        try {
            const { donhangID } = req.params;
            const { USER_ID, NV_ID } = req.user.data;
            const { DA_THANH_TOAN, TRANG_THAI, action } = req.body;

            const isExist = await checkIsExist('DON_HANG', 'MA_DH', donhangID);
            if (!isExist) return res.status(400).json({ message: "Đơn hàng không tồn tại." });

            const CAP_NHAT = getNow();
            let data = {};
            if (action === 'confirm' && NV_ID) {
                data = { ...req.body, CAP_NHAT }
            }
            else if (action === 'received' && USER_ID) {
                data = { TRANG_THAI: 2, CAP_NHAT }
            }
            else if (action === 'cancle' && USER_ID) {
                data = { TRANG_THAI: 3, CAP_NHAT }
            }

            const sql = `UPDATE DON_HANG SET ? WHERE MA_DH='${donhangID}'`;
            await executeUpdateQuery(sql, data);

            res.json({ message: 'Cập nhật đơn hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_donhangs: async (req, res) => {
        try {
            const { donhangID } = req.params;
            const isExist = await checkIsExist('DON_HANG', 'MA_DH', donhangID);
            if (!isExist) return res.status(400).json({ message: "Đơn hàng không tồn tại." });

            const sql = `DELETE FROM DON_HANG WHERE MA_DH='${donhangID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa đơn hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}