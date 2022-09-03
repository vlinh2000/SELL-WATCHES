const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_sanphams: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM SAN_PHAM a, DANH_MUC b, THUONG_HIEU c WHERE a.MA_DANH_MUC = b.MA_DANH_MUC AND a.MA_THUONG_HIEU = c.MA_THUONG_HIEU ORDER BY a.NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            let sanphams = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_SP) as total FROM SAN_PHAM a, DANH_MUC b, THUONG_HIEU c WHERE a.MA_DANH_MUC = b.MA_DANH_MUC AND a.MA_THUONG_HIEU = c.MA_THUONG_HIEU `;
            const data = await executeQuery(sql_count);

            const processes = sanphams?.map((sp, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_ANH_SAN_PHAM = `SELECT * FROM ANH_SAN_PHAM WHERE MA_SP='${sp.MA_SP}'`;
                        const anhsanphams = await executeQuery(sql_ANH_SAN_PHAM);
                        sanphams[idx].ANH_SAN_PHAM = anhsanphams;
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                })
            })
            await Promise.all(processes);
            res.json({
                result: sanphams,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_sanpham: async (req, res) => {
        try {
            const { sanphamID } = req.params;
            const sql = `SELECT * FROM SAN_PHAM WHERE MA_SP='${sanphamID}'`;
            const sanphams = await executeQuery(sql);
            res.json({
                result: sanphams[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_sanphams: async (req, res) => {
        try {
            const { MA_DANH_MUC, MA_THUONG_HIEU, TEN_SP, GIA_GOC, GIA_BAN, SO_LUONG, MO_TA, CHAT_LIEU_DAY, CHAT_LIEU_MAT_KINH, PIN, MUC_CHONG_NUOC, HINH_DANG_MAT_SO, KICH_THUOC_MAT_SO } = req.body;

            const MA_SP = 'SP_' + randomString();
            const sql = `INSERT INTO SAN_PHAM(MA_SP,MA_DANH_MUC, MA_THUONG_HIEU, TEN_SP, GIA_GOC, GIA_BAN, SO_LUONG, MO_TA, CHAT_LIEU_DAY,CHAT_LIEU_MAT_KINH,PIN,MUC_CHONG_NUOC,HINH_DANG_MAT_SO,KICH_THUOC_MAT_SO) 
            VALUES ('${MA_SP}','${MA_DANH_MUC}','${MA_THUONG_HIEU}','${TEN_SP}','${GIA_GOC}','${GIA_BAN}','${SO_LUONG}','${MO_TA}','${CHAT_LIEU_DAY}','${CHAT_LIEU_MAT_KINH}','${PIN}','${MUC_CHONG_NUOC}','${HINH_DANG_MAT_SO}','${KICH_THUOC_MAT_SO}')`;
            await executeQuery(sql);

            // save img to database
            const processes = req.files?.map(f => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const MA_ANH = 'HA_' + randomString();
                        const sql = `INSERT INTO ANH_SAN_PHAM(MA_ANH,MA_SP,HINH_ANH) VALUES('${MA_ANH}','${MA_SP}','${f.path}')`
                        await executeQuery(sql);
                        resolve(true);
                        console.log({ status: 'Done: ' + f.path })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            console.log("Saving ...")
            await Promise.all(processes);
            console.log("Done.")
            res.json({ message: 'Thêm sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_sanphams: async (req, res) => {
        try {
            const { sanphamID } = req.params;
            const isExist = await checkIsExist('SAN_PHAM', 'MA_SP', sanphamID);
            if (!isExist) return res.status(400).json({ message: "Sản phẩm không tồn tại." });

            const data = {
                MA_DANH_MUC: req.body.MA_DANH_MUC, MA_THUONG_HIEU: req.body.MA_THUONG_HIEU,
                TEN_SP: req.body.TEN_SP, GIA_GOC: req.body.GIA_GOC, GIA_BAN: req.body.GIA_BAN,
                SO_LUONG: req.body.SO_LUONG, MO_TA: req.body.MO_TA, CHAT_LIEU_DAY: req.body.CHAT_LIEU_DAY,
                CHAT_LIEU_MAT_KINH: req.body.CHAT_LIEU_MAT_KINH, PIN: req.body.PIN, MUC_CHONG_NUOC: req.body.MUC_CHONG_NUOC,
                HINH_DANG_MAT_SO: req.body.HINH_DANG_MAT_SO, KICH_THUOC_MAT_SO: req.body.KICH_THUOC_MAT_SO, CAP_NHAT: getNow()
            }
            const sql = `UPDATE SAN_PHAM SET ? WHERE MA_SP='${sanphamID}'`;
            console.log({ sql });
            await executeUpdateQuery(sql, { ...data });

            // save img to database
            const processes = req.files?.map(f => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const MA_ANH = 'HA_' + randomString();
                        const sql = `INSERT INTO ANH_SAN_PHAM(MA_ANH,MA_SP,HINH_ANH) VALUES('${MA_ANH}','${sanphamID}','${f.path}')`
                        await executeQuery(sql);
                        resolve(true);
                        console.log({ status: 'Done: ' + f.path })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });
            console.log("Saving ...")
            await Promise.all(processes);
            console.log("Save done.")

            // remove img from database
            const ANH_SAN_PHAM_REMOVE = req.body.ANH_SAN_PHAM_REMOVE ? JSON.parse(req.body.ANH_SAN_PHAM_REMOVE) : [];
            const processes_remove = ANH_SAN_PHAM_REMOVE?.map(id => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql = `DELETE FROM ANH_SAN_PHAM WHERE MA_ANH='${id}'`;
                        await executeQuery(sql);
                        resolve(true);
                        console.log({ status: 'Done: ' + id })
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

            console.log("removing ...")
            await Promise.all(processes_remove);
            console.log("Removing done.")

            res.json({ message: 'Cập nhật sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_sanphams: async (req, res) => {
        try {
            const { sanphamID } = req.params;
            const isExist = await checkIsExist('SAN_PHAM', 'MA_SP', sanphamID);
            if (!isExist) return res.status(400).json({ message: "Sản phẩm không tồn tại." });

            const sql = `DELETE FROM SAN_PHAM WHERE MA_SP='${sanphamID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa sản phẩm thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}