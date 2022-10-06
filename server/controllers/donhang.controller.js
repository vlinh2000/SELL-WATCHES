const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow, handleMomoPayment } = require("../utils/global");

module.exports = {
    get_donhangs: async (req, res) => {
        try {
            const { _limit, _page, action, MA_SP } = req.query;
            let { status } = req.query;
            console.log({ status })
            const user = req.user?.data;

            if (action === 'check_had_order') {
                const sql = `SELECT COUNT(a.MA_DH) as total
                             FROM DON_HANG a, CHI_TIET_DON_HANG b 
                             WHERE a.USER_ID='${user?.USER_ID}' AND a.MA_DH=b.MA_DH AND b.MA_SP='${MA_SP}'`;
                let data = await executeQuery(sql);
                console.log({ sql })
                console.log({ data })
                return res.json({
                    // result: data,
                    available: data[0].total > 0 ? true : false,
                    message: 'Thành công'
                });
            }

            const sql = `SELECT a.MA_DH,a.HO_TEN_NGUOI_DAT,a.EMAIL_NGUOI_DAT,a.SDT_NGUOI_DAT,a.NV_ID,a.DON_VI_VAN_CHUYEN, b.HO_TEN, a.USER_ID, a.TG_DAT_HANG, a.TG_GIAO_HANG, a.DIA_CHI, a.GIAM_GIA, a.TONG_TIEN, a.TRANG_THAI, a.DA_THANH_TOAN, a.HINH_THUC_THANH_TOAN, a.PHI_SHIP, a.GHI_CHU, a.NGAY_TAO,c.MA_UU_DAI,c.TEN_UU_DAI,c.MPVC 
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        LEFT JOIN UU_DAI c ON a.MA_UU_DAI = c.MA_UU_DAI 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${status ? 'AND a.TRANG_THAI IN ' + JSON.parse(status)?.replace('[', '(')?.replace(']', ')') : ''} 
                        ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            console.log({ sql })
            let donhangs = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_DH) as total 
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${status ? 'AND a.TRANG_THAI IN ' + JSON.parse(status)?.replace('[', '(')?.replace(']', ')') : ''} `;
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
            const { dateFrom, dateTo, groupBy, action } = req.query;

            if (action === 'get_only_statistical') {
                let result = [];
                const sqls = [
                    `SELECT COALESCE(SUM(a.TONG_TIEN),0) as DOANH_THU FROM DON_HANG a WHERE a.DA_THANH_TOAN = '1'`,
                    `SELECT COALESCE(SUM(a.TONG_TIEN),0) as TIEN_VON FROM PHIEU_NHAP_KHO a`
                ];

                const processes = sqls.map((sql, idx) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const data = await executeQuery(sql);
                            result[idx] = data[0].DOANH_THU || data[0].TIEN_VON;
                            resolve(true)
                        } catch (error) {
                            console.log({ error })
                            reject(false);
                        }
                    })
                })
                await Promise.all(processes);
                const thongkes = {
                    DOANH_THU: result[0],
                    LOI_NHUAN: result[0] - result[1],
                    TIEN_VON: result[1]
                }
                return res.json({
                    result: thongkes,
                    message: 'Thành công'
                });
            }


            let groupByName = '';
            let selectFieldName = ''
            switch (groupBy) {
                case 'day': {
                    groupByName = `DATE_FORMAT(a.TG_DAT_HANG,'%Y-%m-%d')`;
                    selectFieldName = `CONCAT('Ngày ',DATE_FORMAT(a.TG_DAT_HANG,'%d-%m-%Y'))`
                    break;
                }
                case 'week': {
                    groupByName = `CONCAT(YEAR(a.TG_DAT_HANG), '/', WEEK(a.TG_DAT_HANG))`;
                    selectFieldName = `CONCAT('Tuần ', WEEK(a.TG_DAT_HANG),',',YEAR(a.TG_DAT_HANG) )`
                    break;
                }
                case 'month': {
                    groupByName = `YEAR(a.TG_DAT_HANG),MONTH(a.TG_DAT_HANG)`;
                    selectFieldName = `CONCAT('Tháng ',MONTH(a.TG_DAT_HANG),',',YEAR(a.TG_DAT_HANG))`;
                    break;
                }
                case 'quarter': {
                    groupByName = `YEAR(a.TG_DAT_HANG), QUARTER(a.TG_DAT_HANG)`;
                    selectFieldName = `CONCAT('Quý ',QUARTER(a.TG_DAT_HANG),',',YEAR(a.TG_DAT_HANG) )`
                    break;
                }
                case 'year': {
                    groupByName = `YEAR(a.TG_DAT_HANG)`;
                    selectFieldName = `CONCAT('Năm ',YEAR(a.TG_DAT_HANG))`
                    break;
                }
            }

            const sql = `SELECT ${selectFieldName} as TEN_THONG_KE, SUM(b.GIA) as TONG_TIEN,SUM(b.GIA_GOC * b.SO_LUONG) as TIEN_VON
                        FROM DON_HANG a,CHI_TIET_DON_HANG b
                        WHERE 
                            a.MA_DH=b.MA_DH  
                            AND a.TG_DAT_HANG between '${dateFrom + ' 00:00:00'}' AND '${dateTo + ' 23:59:59'}' 
                            AND a.DA_THANH_TOAN = '1'
                        GROUP BY ${groupByName}`;
            const thongkes = await executeQuery(sql);
            console.log({ sql })
            res.json({
                result: thongkes,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_donhangs: async (req, res) => {
        try {
            const { isCompleteOrder, data } = req.body;
            let { USER_ID, DIA_CHI_GH, GIAM_GIA, TONG_TIEN, DA_THANH_TOAN, HINH_THUC_THANH_TOAN, PHI_SHIP, GHI_CHU, HO_TEN_NGUOI_DAT,
                SDT_NGUOI_DAT, EMAIL_NGUOI_DAT, MA_UU_DAI, SAN_PHAM, orderId } = isCompleteOrder ? JSON.parse(Buffer.from(data, 'base64').toString('utf8')) : req.body;
            SAN_PHAM = JSON.parse(SAN_PHAM);
            DA_THANH_TOAN = isCompleteOrder ? 1 : DA_THANH_TOAN;

            const MA_DH = isCompleteOrder ? orderId : 'DH_' + randomString();
            const sql = `INSERT INTO DON_HANG(MA_DH,${USER_ID ? 'USER_ID,' : ''} DIA_CHI, GIAM_GIA, TONG_TIEN, DA_THANH_TOAN, HINH_THUC_THANH_TOAN, PHI_SHIP, GHI_CHU,HO_TEN_NGUOI_DAT,
                SDT_NGUOI_DAT,EMAIL_NGUOI_DAT,MA_UU_DAI) 
                VALUES ('${MA_DH}',${USER_ID ? `'${USER_ID}',` : ''}'${DIA_CHI_GH}',${GIAM_GIA},${TONG_TIEN},'${DA_THANH_TOAN}','${HINH_THUC_THANH_TOAN}',${PHI_SHIP},'${GHI_CHU || ""}','${HO_TEN_NGUOI_DAT}','${SDT_NGUOI_DAT}','${EMAIL_NGUOI_DAT}','${MA_UU_DAI || ""}')`;
            await executeQuery(sql);

            // loop here
            const processes = SAN_PHAM?.map(sp => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sqlDetail = `INSERT INTO CHI_TIET_DON_HANG(MA_DH,MA_SP, SO_LUONG, DON_GIA,GIA,GIA_GOC) VALUES ('${MA_DH}','${sp.MA_SP}',${sp.SO_LUONG},${sp.DON_GIA},${sp.GIA},${sp.GIA_GOC})`;
                        console.log({ sqlDetail })
                        await executeQuery(sqlDetail);
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            await Promise.all(processes);
            console.log("ok")
            const sql_delete = `UPDATE USER_UU_DAI SET SU_DUNG=1 WHERE USER_ID='${USER_ID}' AND MA_UU_DAI='${MA_UU_DAI}'`;
            MA_UU_DAI && USER_ID && await executeQuery(sql_delete);
            console.log(sql_delete)

            res.json({ message: 'Đặt hàng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_donhangs: async (req, res) => {
        try {
            const { donhangID } = req.params;
            const { USER_ID, NV_ID } = req.user.data;
            const { DA_THANH_TOAN, TRANG_THAI, action, TG_GIAO_HANG } = req.body;
            console.log(req.body)
            const isExist = await checkIsExist('DON_HANG', 'MA_DH', donhangID);
            if (!isExist) return res.status(400).json({ message: "Đơn hàng không tồn tại." });

            const CAP_NHAT = getNow();
            let data = {};
            if (action === 'confirm' && NV_ID) {
                data = { TRANG_THAI: 1, CAP_NHAT, NV_ID, TG_GIAO_HANG }
            }
            else if (action === 'received') {
                data = { TRANG_THAI: 2, CAP_NHAT, DA_THANH_TOAN: 1 }
            }
            else if (action === 'cancle') {
                const sql_restore = `SELECT MA_SP,SO_LUONG FROM CHI_TIET_DON_HANG WHERE MA_DH='${donhangID}'`;
                const listProductForRestore = await executeQuery(sql_restore);

                const processes = listProductForRestore.map(sp => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const sql_restore_quantity = `UPDATE SAN_PHAM SET SO_LUONG=SO_LUONG + ${sp.SO_LUONG} WHERE MA_SP='${sp.MA_SP}'`;
                            await executeQuery(sql_restore_quantity);
                            resolve(true);
                        } catch (error) {
                            reject(false);
                        }
                    })
                })

                await Promise.all(processes);
                data = { TRANG_THAI: 3, CAP_NHAT }
            }
            console.log({ data })
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
    }, get_payUrl: async (req, res) => {
        try {
            let { wallet, data } = req.query;
            data = JSON.parse(data)
            let result;
            switch (wallet) {
                case 'momo_wallet': {
                    result = await handleMomoPayment(data);
                    break;
                }
                default: ''
            }
            res.json({ result, message: 'Thành công' })
        } catch (error) {
            console.log({ error });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}