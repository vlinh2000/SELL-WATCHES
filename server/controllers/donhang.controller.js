const moment = require("moment/moment");
const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { sendMail } = require("../services/mail/mail");
const { TEMPLATE_ORDER_SUCCESS } = require("../services/mail/templates");
const { randomString, getNow, handleMomoPayment, numberWithCommas } = require("../utils/global");

module.exports = {
    get_donhangs: async (req, res) => {
        try {
            const { _limit, _page, action, MA_SP } = req.query;
            let { status } = req.query;
            const user = req.user?.data;
            let subSqlSearch = '';

            if (action === 'check_had_order') {
                const sql = `SELECT COUNT(a.MA_DH) as total
                             FROM DON_HANG a, CHI_TIET_DON_HANG b 
                             WHERE a.USER_ID='${user?.USER_ID}' AND a.TRANG_THAI=2 AND a.MA_DH=b.MA_DH AND b.MA_SP='${MA_SP}'`;
                let data = await executeQuery(sql);
                return res.json({
                    // result: data,
                    available: data[0].total > 0 ? true : false,
                    message: 'Thành công'
                });
            } else if (action === 'search') {
                console.log(req.query.searchInfo);
                const searchInfo = JSON.parse(req.query.searchInfo);
                subSqlSearch = `
                ${searchInfo.MA_DH ? ` AND a.MA_DH LIKE '%${searchInfo.MA_DH}%'` : ''}
                ${searchInfo.HO_TEN_NGUOI_DAT ? ` AND a.HO_TEN_NGUOI_DAT LIKE '%${searchInfo.HO_TEN_NGUOI_DAT}%'` : ''}
                ${searchInfo.SDT_NGUOI_DAT ? ` AND a.SDT_NGUOI_DAT LIKE '%${searchInfo.SDT_NGUOI_DAT}%'` : ''}
                ${(searchInfo.TG_DAT_HANG_TU || searchInfo.TG_DAT_HANG_DEN) ? ` AND a.TG_DAT_HANG BETWEEN '${moment(searchInfo.TG_DAT_HANG_TU || '1-1-1970').format('YYYY-MM-DD') + ' 00:00:00'}' AND '${moment(searchInfo.TG_DAT_HANG_DEN || moment()).format('YYYY-MM-DD') + ' 23:59:59'}'` : ''}
                ${searchInfo.HINH_THUC_THANH_TOAN ? ` AND a.HINH_THUC_THANH_TOAN='${searchInfo.HINH_THUC_THANH_TOAN}'` : ''}`;
                console.log({ subSqlSearch })
            }

            const sql = `SELECT a.MA_DH,a.HO_TEN_NGUOI_DAT,a.EMAIL_NGUOI_DAT,a.SDT_NGUOI_DAT,a.NV_ID,a.DON_VI_VAN_CHUYEN, b.HO_TEN, a.USER_ID, a.TG_DAT_HANG, a.TG_GIAO_HANG, a.DIA_CHI, a.GIAM_GIA, a.TONG_TIEN, a.TRANG_THAI, a.DA_THANH_TOAN, a.HINH_THUC_THANH_TOAN, a.PHI_SHIP, a.GHI_CHU, a.NGAY_TAO,a.CAP_NHAT,c.MA_UU_DAI,c.TEN_UU_DAI,c.MPVC 
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        LEFT JOIN UU_DAI c ON a.MA_UU_DAI = c.MA_UU_DAI 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${action === 'search' ? subSqlSearch : ''} 
                        ${status ? 'AND a.TRANG_THAI IN ' + JSON.parse(status)?.replace('[', '(')?.replace(']', ')') : ''} 
                        ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            console.log({ sql })
            let donhangs = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_DH) as total 
                        FROM DON_HANG a
                        LEFT JOIN NHAN_VIEN b ON a.NV_ID = b.NV_ID 
                        WHERE 1=1
                        ${action === 'get_my_orders' ? ` AND a.USER_ID ='${user.USER_ID}'` : ''} 
                        ${action === 'search' ? subSqlSearch : ''} 
                        ${status ? 'AND a.TRANG_THAI IN ' + JSON.parse(status)?.replace('[', '(')?.replace(']', ')') : ''} `;
            const data = await executeQuery(sql_count);

            // get detail (CHI_TIET_DON_HANG)
            const processes = donhangs?.map((dh, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_detail = `SELECT a.MA_DH, a.SO_LUONG, a.DON_GIA, a.GIA,b.MA_SP, b.TEN_SP, c.HINH_ANH
                                            FROM CHI_TIET_DON_HANG a , SAN_PHAM b 
                                            LEFT JOIN ANH_SAN_PHAM c ON b.MA_SP= c.MA_SP 
                                            WHERE a.MA_SP = b.MA_SP AND a.MA_DH='${dh.MA_DH}' GROUP BY a.MA_SP`;
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
                    `SELECT COALESCE(SUM(a.TONG_TIEN),0) as DOANH_THU FROM DON_HANG a WHERE a.TRANG_THAI !=3`,
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
                            AND a.TRANG_THAI != 3
                            GROUP BY ${groupByName}`;
            const thongkes = await executeQuery(sql);
            console.log({ sql1: sql })

            const result = {};
            if (action === 'more-data') {
                // get top seller
                // get top bought
                const sqls_moreData = [
                    `
                    SELECT b.MA_SP,c.TEN_SP,d.HINH_ANH,e.TEN_LOAI_SP,SUM(b.SO_LUONG) AS TONG_SO
                    FROM DON_HANG a,CHI_TIET_DON_HANG b,SAN_PHAM c
                    LEFT JOIN ANH_SAN_PHAM d ON c.MA_SP =d.MA_SP
                    LEFT JOIN LOAI_SAN_PHAM e ON c.MA_LOAI_SP =e.MA_LOAI_SP
                    WHERE 
                    a.MA_DH=b.MA_DH AND b.MA_SP=c.MA_SP AND a.TG_DAT_HANG 
                    BETWEEN '${dateFrom + ' 00:00:00'}' AND '${dateTo + ' 23:59:59'}'   
                    AND a.TRANG_THAI !=3 GROUP BY b.MA_SP ORDER BY TONG_SO DESC LIMIT 5`
                    ,
                    `SELECT b.USER_ID,b.HO_TEN,a.DIA_CHI,b.ANH_DAI_DIEN,b.LOAI_TAI_KHOAN,SUM(a.TONG_TIEN) AS TONG_SO
                    FROM DON_HANG a, USER b
                    WHERE 
                    a.USER_ID=b.USER_ID AND a.TG_DAT_HANG 
                    BETWEEN '${dateFrom + ' 00:00:00'}' AND '${dateTo + ' 23:59:59'}'  
                    AND a.TRANG_THAI !=3 GROUP BY a.USER_ID ORDER BY TONG_SO DESC LIMIT 5	`
                ];

                const processes_moreData = sqls_moreData.map((sql, idx) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const data = await executeQuery(sql);
                            const key = idx === 0 ? 'TOP_SP_BAN_CHAY' : 'TOP_USER'
                            result[key] = data;
                            resolve(true)
                        } catch (error) {
                            console.log({ error })
                            reject(false);
                        }
                    })
                })
                await Promise.all(processes_moreData);

            }

            res.json({
                result: thongkes,
                moreData: result,
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
            // console.log(sql_delete)
            // send mail
            const dataMail = {
                MA_DH,
                DIA_CHI: DIA_CHI_GH,
                HINH_THUC_THANH_TOAN,
                TONG_TIEN: numberWithCommas(TONG_TIEN),
                PHI_SHIP: PHI_SHIP === GIAM_GIA ? 0 : numberWithCommas(PHI_SHIP),
                DS_SP: SAN_PHAM
            }
            await sendMail(EMAIL_NGUOI_DAT, 'Thông báo đặt hàng thành công', TEMPLATE_ORDER_SUCCESS(dataMail));
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
                data = { TRANG_THAI: 2, CAP_NHAT, DA_THANH_TOAN: 1, TG_GIAO_HANG: getNow() }
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
    },
    get_payUrl: async (req, res) => {
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