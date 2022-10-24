const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_quyens: async (req, res) => {
        try {
            const { _limit, _page, action } = req.query;

            if (action === 'get_user_rules') {
                let { NV_ID } = req.query;
                const sql_all_user_rules = `SELECT MA_QUYEN FROM QUYEN_NHAN_VIEN WHERE NV_ID='${NV_ID || req.user?.data.NV_ID}'`;
                const quyens = await executeQuery(sql_all_user_rules);
                // console.log({ sql_all_user_rules })
                return res.json({
                    result: quyens,
                    message: 'Thành công'
                });
            }

            const sql = `SELECT * FROM QUYEN ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const quyens = await executeQuery(sql);
            const sql_count = `SELECT COUNT(MA_QUYEN) as total FROM QUYEN`;
            const data = await executeQuery(sql_count);

            res.json({
                result: quyens,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_quyen: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const sql = `SELECT * FROM QUYEN WHERE MA_QUYEN='${quyenID}'`;
            const quyens = await executeQuery(sql);
            res.json({
                result: quyens[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_quyens: async (req, res) => {
        try {
            const { TEN_QUYEN, MA_QUYEN } = req.body;
            let { action, NHAN_VIENS } = req.body;
            console.log({ action })
            if (action === 'employee_rules') {
                NHAN_VIENS = JSON.parse(NHAN_VIENS);
                const processes = Object.keys(NHAN_VIENS).map(NV_ID => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const sql_resetRules = `DELETE FROM QUYEN_NHAN_VIEN WHERE NV_ID='${NV_ID}'`
                            await executeQuery(sql_resetRules);
                            console.log(sql_resetRules)

                            const processes_sub = NHAN_VIENS[NV_ID].map(MA_QUYEN => {
                                return new Promise(async (resolveSub, rejectSub) => {
                                    try {
                                        const sql_newRule = `INSERT INTO QUYEN_NHAN_VIEN(MA_QUYEN,NV_ID) VALUES ('${MA_QUYEN}','${NV_ID}')`
                                        await executeQuery(sql_newRule);
                                        resolveSub(true);
                                    } catch (error) {
                                        rejectSub(error);
                                    }
                                })
                            })
                            await Promise.all(processes_sub);
                            console.log("DONE: " + NV_ID);
                            resolve(true);
                        } catch (error) {
                            reject(error);
                        }
                    })

                })

                await Promise.all(processes);
                return res.json({ message: 'Lưu thành công .' });
            }

            const isExist = await checkIsExist('QUYEN', 'MA_QUYEN', MA_QUYEN);
            if (isExist) return res.status(400).json({ message: `Quyền [${MA_QUYEN}] đã tồn tại.` });

            const sql = `INSERT INTO QUYEN(MA_QUYEN,TEN_QUYEN) 
                                        VALUES ('${MA_QUYEN}','${TEN_QUYEN}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_quyens: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const isExist = await checkIsExist('QUYEN', 'MA_QUYEN', quyenID);
            if (!isExist) return res.status(400).json({ message: "Quyền không tồn tại." });

            const sql = `UPDATE QUYEN SET ? WHERE MA_QUYEN='${quyenID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_quyens: async (req, res) => {
        try {
            const { quyenID } = req.params;
            const isExist = await checkIsExist('QUYEN', 'MA_QUYEN', quyenID);
            if (!isExist) return res.status(400).json({ message: "Quyền không tồn tại." });

            const sql = `DELETE FROM QUYEN WHERE MA_QUYEN='${quyenID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa quyền thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}