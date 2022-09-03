const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_phieunhaps: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT a.MA_PHIEU_NHAP, a.NV_ID, c.HO_TEN, a.MA_NCC, b.TEN_NCC, a.TONG_TIEN, a.GHI_CHU, a.NGAY_TAO FROM PHIEU_NHAP_KHO a, NHA_CUNG_CAP b ,NHAN_VIEN c WHERE a.MA_NCC = b.MA_NCC AND a.NV_ID = c.NV_ID ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            let phieunhaps = await executeQuery(sql);

            const sql_count = `SELECT COUNT(a.MA_PHIEU_NHAP) as total FROM PHIEU_NHAP_KHO a, NHA_CUNG_CAP b ,NHAN_VIEN c WHERE a.MA_NCC = b.MA_NCC AND a.NV_ID = c.NV_ID`;
            const data = await executeQuery(sql_count);

            // get detail (CHI_TIET_PHIEU_NHAP)
            const processes = phieunhaps?.map((sp, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_detail = `SELECT a.MA_SP, a.SO_LUONG, a.DON_GIA, a.GIA, b.TEN_SP FROM CHI_TIET_PHIEU_NHAP a , SAN_PHAM b WHERE a.MA_SP = b.MA_SP AND a.MA_PHIEU_NHAP='${sp.MA_PHIEU_NHAP}'`;
                        phieunhaps[idx].SAN_PHAM = await executeQuery(sql_detail);
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            await Promise.all(processes);
            res.json({
                result: phieunhaps,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_phieunhap: async (req, res) => {
        try {
            const { phieunhapID } = req.params;
            const sql = `SELECT * FROM PHIEU_NHAP_KHO a, CHI_TIET_PHIEU_NHAP b WHERE a.MA_PHIEU_NHAP = b.MA_PHIEU_NHAP AND MA_PHIEU_NHAP='${phieunhapID}'`;
            const phieunhaps = await executeQuery(sql);
            res.json({
                result: phieunhaps[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_phieunhaps: async (req, res) => {
        try {
            const { NV_ID, MA_NCC, GHI_CHU, TONG_TIEN } = req.body;
            const { SAN_PHAM } = req.body;
            const MA_PHIEU_NHAP = 'PN_' + randomString();
            const sql = `INSERT INTO PHIEU_NHAP_KHO(MA_PHIEU_NHAP,NV_ID, MA_NCC, GHI_CHU, TONG_TIEN) 
                                        VALUES ('${MA_PHIEU_NHAP}','${NV_ID}','${MA_NCC}','${GHI_CHU || ''}','${TONG_TIEN}')`;

            await executeQuery(sql);
            // save to detail
            const processes = SAN_PHAM?.map(sp => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_detail = `INSERT INTO CHI_TIET_PHIEU_NHAP(MA_PHIEU_NHAP,MA_SP, SO_LUONG, DON_GIA,GIA)
                                        VALUES ('${MA_PHIEU_NHAP}','${sp.MA_SP}','${sp.SO_LUONG}','${sp.DON_GIA}','${sp.GIA}')`;
                        await executeQuery(sql_detail);
                        console.log({ status: 'Done: ' + sp.MA_SP })
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });
            console.log("detail ...")
            await Promise.all(processes);
            console.log("Save done.")

            res.json({ message: 'Thêm phiếu nhập thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_phieunhaps: async (req, res) => {
        try {
            const { phieunhapID } = req.params;
            const { SAN_PHAM } = req.body;
            const isExist = await checkIsExist('PHIEU_NHAP_KHO', 'MA_PHIEU_NHAP', phieunhapID);
            if (!isExist) return res.status(400).json({ message: "Phiếu nhập không tồn tại." });
            const sql = `UPDATE PHIEU_NHAP_KHO SET ? WHERE MA_PHIEU_NHAP='${phieunhapID}'`;
            const data = {
                MA_NCC: req.body.MA_NCC,
                GHI_CHU: req.body.GHI_CHU,
                TONG_TIEN: req.body.TONG_TIEN,
                CAP_NHAT: getNow()
            }
            await executeUpdateQuery(sql, { ...data });
            // remove old products
            const sql_remove = `DELETE FROM CHI_TIET_PHIEU_NHAP WHERE MA_PHIEU_NHAP='${phieunhapID}'`;
            await executeQuery(sql_remove);
            console.log({ status: 'Removed.' })
            // update detail
            const processes = SAN_PHAM?.map(sp => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_detail = `INSERT INTO CHI_TIET_PHIEU_NHAP(MA_PHIEU_NHAP,MA_SP, SO_LUONG, DON_GIA,GIA)
                            VALUES ('${phieunhapID}','${sp.MA_SP}','${sp.SO_LUONG}','${sp.DON_GIA}','${sp.GIA}')`;
                        await executeQuery(sql_detail);
                        console.log({ status: 'Done (add): ' + sp.MA_SP })
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });
            console.log("detail ...")
            await Promise.all(processes);
            console.log("Saved.")

            res.json({ message: 'Cập nhật phiếu nhập thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_phieunhaps: async (req, res) => {
        try {
            const { phieunhapID } = req.params;
            const isExist = await checkIsExist('PHIEU_NHAP_KHO', 'MA_PHIEU_NHAP', phieunhapID);
            if (!isExist) return res.status(400).json({ message: "Phiếu nhập không tồn tại." });

            const sql = `DELETE FROM PHIEU_NHAP_KHO WHERE MA_PHIEU_NHAP='${phieunhapID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa phiếu nhập thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}