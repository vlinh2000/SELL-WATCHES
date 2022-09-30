const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_sanphams: async (req, res) => {
        try {
            const { _limit, _page, filterBy } = req.query;
            const { groupBy, tableName } = req.query;
            let { groupFilterBy, sortBy, searchValue } = req.query;

            // group by category then return total of product of category
            if (groupBy) {
                let sql;
                if (groupBy === 'GIA') {
                    sql = `SELECT MIN(GIA_BAN) AS GIA_TU, MAX(GIA_BAN) AS GIA_DEN FROM SAN_PHAM`;

                } else {
                    sql = `SELECT COUNT(a.MA_SP) as quantity,a.${groupBy} as id ${tableName ? ',b.TEN_' + (tableName === 'LOAI_SAN_PHAM' ? 'LOAI_SP' : tableName) + ' as label' : ' ,a.' + groupBy + ' as label'} 
                                FROM SAN_PHAM a${tableName ? ',' + tableName + ' b' : ''} 
                                ${tableName ? 'WHERE a.' + groupBy + '=b.' + groupBy : ''}
                                GROUP BY a.${groupBy}
                                    `;
                }
                const sanphams = await executeQuery(sql);
                return res.json({
                    groupBy,
                    result: sanphams,
                    message: 'Thành công'
                });
            }

            // filter by
            let subCondition = '';
            groupFilterBy = JSON.parse(groupFilterBy || '{}');
            let groupFilterByFields = Object.keys(groupFilterBy);

            if (groupFilterByFields.length > 0) {
                subCondition = groupFilterByFields
                    .filter(field => groupFilterBy[field].length > 0)
                    .map((field) => field === 'GIA_BAN' ? ` AND a.GIA_BAN BETWEEN ${groupFilterBy[field][0]} AND ${groupFilterBy[field][1]}` : ` AND a.${field} IN ${JSON.stringify(groupFilterBy[field]).replace('[', '(').replace(']', ')')}`).join("");
            }

            let sortByCondition = 'a.NGAY_TAO DESC ';
            sortBy = JSON.parse(sortBy || '{}');
            if (Object.keys(sortBy).length > 0) {
                sortByCondition = sortBy.fieldName.includes('DIEM') ? `${sortBy.fieldName} ${sortBy.sortValue} ` : `a.${sortBy.fieldName} ${sortBy.sortValue} `
            }

            // have searchValue
            let searchCondition = '';
            if (searchValue) {
                searchCondition = ` AND ( a.TEN_SP LIKE '%${searchValue}%' OR b.TEN_LOAI_SP LIKE '%${searchValue}%' OR c.TEN_THUONG_HIEU LIKE '%${searchValue}%') `
            }

            // get all products normal
            const sql = `SELECT a.MA_SP,a.MA_LOAI_SP,a.MA_THUONG_HIEU,a.TEN_SP,a.GIA_GOC,a.GIA_BAN,a.SO_LUONG,a.MO_TA,a.CHAT_LIEU_DAY,a.CHAT_LIEU_MAT_KINH,a.PIN,a.MUC_CHONG_NUOC,a.HINH_DANG_MAT_SO,a.KICH_THUOC_MAT_SO,a.MAU_MAT_SO,a.TRANG_THAI,a.NGAY_TAO,a.CAP_NHAT,b.TEN_LOAI_SP,c.TEN_THUONG_HIEU,e.HINH_ANH, COALESCE(AVG(d.SO_SAO),0) as DIEM_TB 
                        FROM SAN_PHAM a
                        LEFT JOIN DANH_GIA d ON a.MA_SP = d.MA_SP
                        INNER JOIN LOAI_SAN_PHAM b ON a.MA_LOAI_SP = b.MA_LOAI_SP
                        INNER JOIN THUONG_HIEU c ON a.MA_THUONG_HIEU = c.MA_THUONG_HIEU
                        LEFT JOIN ANH_SAN_PHAM e ON a.MA_SP = e.MA_SP 
                        WHERE 1=1  
                        ${filterBy ? 'AND a.' + filterBy + "='" + req.query[filterBy] + "' " : ''}
                        ${subCondition}
                        ${searchCondition}
                        GROUP BY a.MA_SP 
                        ORDER BY ${sortByCondition}
                        ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;

            let sanphams = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_SP) as total 
                                FROM SAN_PHAM a
                                INNER JOIN LOAI_SAN_PHAM b ON a.MA_LOAI_SP = b.MA_LOAI_SP
                                INNER JOIN THUONG_HIEU c ON a.MA_THUONG_HIEU = c.MA_THUONG_HIEU
                                WHERE 1=1 
                                ${filterBy ? 'AND a.' + filterBy + "='" + req.query[filterBy] + "' " : ''}
                                ${subCondition}
                                ${searchCondition}`;
            const data = await executeQuery(sql_count);

            // 
            const processes = sanphams.map((sp, idx) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql = `SELECT MA_ANH,HINH_ANH FROM ANH_SAN_PHAM WHERE MA_SP='${sp.MA_SP}'`
                        const anhsanphams = await executeQuery(sql);
                        sanphams[idx].ANH_SAN_PHAM = anhsanphams;
                        resolve(true);
                    } catch (error) {
                        console.log({ error })
                        reject(error);
                    }
                })
            });

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
            const sql = `SELECT a.MA_SP,a.MA_LOAI_SP,a.MA_THUONG_HIEU,a.TEN_SP,a.GIA_GOC,a.GIA_BAN,a.SO_LUONG,a.MO_TA,a.CHAT_LIEU_DAY,a.CHAT_LIEU_MAT_KINH,a.PIN,a.MUC_CHONG_NUOC,a.HINH_DANG_MAT_SO,a.KICH_THUOC_MAT_SO,a.MAU_MAT_SO,a.TRANG_THAI,a.NGAY_TAO,a.CAP_NHAT,b.TEN_LOAI_SP,c.TEN_THUONG_HIEU,c.QUOC_GIA, COALESCE(AVG(d.SO_SAO),0) as DIEM_TB 
                        FROM SAN_PHAM a
                        LEFT JOIN DANH_GIA d ON a.MA_SP = d.MA_SP
                        INNER JOIN LOAI_SAN_PHAM b ON a.MA_LOAI_SP = b.MA_LOAI_SP
                        INNER JOIN THUONG_HIEU c ON a.MA_THUONG_HIEU = c.MA_THUONG_HIEU
                        WHERE a.MA_SP='${sanphamID}'`;
            let sanphams = await executeQuery(sql);

            const sql_ANH_SAN_PHAM = `SELECT * FROM ANH_SAN_PHAM WHERE MA_SP='${sanphamID}'`;
            const anhsanphams = await executeQuery(sql_ANH_SAN_PHAM);
            sanphams[0].ANH_SAN_PHAM = anhsanphams;

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
            const { MA_DANH_MUC, MA_THUONG_HIEU, TEN_SP, GIA_GOC, GIA_BAN, SO_LUONG, MO_TA, CHAT_LIEU_DAY, CHAT_LIEU_MAT_KINH, PIN, MUC_CHONG_NUOC, HINH_DANG_MAT_SO, MAU_MAT_SO, KICH_THUOC_MAT_SO } = req.body;

            const MA_SP = 'SP_' + randomString();
            const sql = `INSERT INTO SAN_PHAM(MA_SP,MA_DANH_MUC, MA_THUONG_HIEU, TEN_SP, GIA_GOC, GIA_BAN, SO_LUONG, MO_TA, CHAT_LIEU_DAY,CHAT_LIEU_MAT_KINH,PIN,MUC_CHONG_NUOC,HINH_DANG_MAT_SO,MAU_MAT_SO,KICH_THUOC_MAT_SO) 
            VALUES ('${MA_SP}','${MA_DANH_MUC}','${MA_THUONG_HIEU}','${TEN_SP}','${GIA_GOC}','${GIA_BAN}','${SO_LUONG}','${MO_TA}','${CHAT_LIEU_DAY}','${CHAT_LIEU_MAT_KINH}','${PIN}','${MUC_CHONG_NUOC}','${HINH_DANG_MAT_SO}','${MAU_MAT_SO}','${KICH_THUOC_MAT_SO}')`;
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
                MA_LOAI_SP: req.body.MA_LOAI_SP, MA_THUONG_HIEU: req.body.MA_THUONG_HIEU,
                TEN_SP: req.body.TEN_SP, GIA_GOC: req.body.GIA_GOC, GIA_BAN: req.body.GIA_BAN,
                SO_LUONG: req.body.SO_LUONG, MO_TA: req.body.MO_TA, CHAT_LIEU_DAY: req.body.CHAT_LIEU_DAY,
                CHAT_LIEU_MAT_KINH: req.body.CHAT_LIEU_MAT_KINH, PIN: req.body.PIN, MUC_CHONG_NUOC: req.body.MUC_CHONG_NUOC,
                HINH_DANG_MAT_SO: req.body.HINH_DANG_MAT_SO, MAU_MAT_SO: req.body.MAU_MAT_SO, KICH_THUOC_MAT_SO: req.body.KICH_THUOC_MAT_SO, CAP_NHAT: getNow()
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