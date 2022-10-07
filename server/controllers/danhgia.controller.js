const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_danhgias: async (req, res) => {
        try {
            const { _limit, _page, MA_SP, action, sortBy } = req.query;

            if (action) {

                if (action === 'groupByFeedBackByNumStar') {
                    const sql_group = `SELECT SO_SAO, COUNT(SO_SAO) AS TONG_SO,SUM(SO_SAO) as TONG_DIEM
                                FROM DANH_GIA 
                                WHERE MA_SP='${MA_SP}' 
                                GROUP BY SO_SAO `;

                    const data_group = await executeQuery(sql_group);
                    return res.json({
                        result: data_group,
                        message: 'Thành công'
                    });
                }

            }

            let sortCondition = `NGAY_TAO DESC`
            if (sortBy) {
                sortCondition = sortBy;
            }

            const sql = `SELECT a.MA_DG,a.SO_SAO,a.NOI_DUNG,a.NGAY_TAO,b.USER_ID,b.HO_TEN,b.ANH_DAI_DIEN
                        FROM DANH_GIA a, USER b 
                        WHERE 
                            a.USER_ID = b.USER_ID AND MA_SP='${MA_SP}'
                        ORDER BY a.${sortCondition}
                        ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            let danhgias = await executeQuery(sql);

            const sql_count = `SELECT COUNT(a.MA_DG) as total 
                                FROM DANH_GIA a, USER b 
                                WHERE
                                    a.USER_ID = b.USER_ID AND MA_SP='${MA_SP}'`;
            const data = await executeQuery(sql_count);

            // const getAllResponseOfFeedBack = danhgias.map((f, idx) => {
            //     return new Promise(async (resolve, reject) => {
            //         try {
            //             const sql = `SELECT * FROM PHAN_HOI WHERE MA_DG='${f.MA_DG}'`;
            //             const phanhois = await executeQuery(sql);
            //             danhgias[idx].PHAN_HOI = phanhois;
            //             resolve(true);

            //             console.log({ status: 'Done: ' + f.MA_DG })
            //         } catch (error) {
            //             console.log({ error })
            //             reject(error);
            //         }
            //     })
            // });

            // await Promise.all(getAllResponseOfFeedBack);
            res.json({
                result: danhgias,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_danhgia: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const sql = `SELECT * FROM DANH_GIA WHERE MA_DG='${danhgiaID}'`;
            const danhgias = await executeQuery(sql);
            res.json({
                result: danhgias[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_danhgias: async (req, res) => {
        try {
            console.log(req.body)
            const { MA_SP, NOI_DUNG, SO_SAO } = req.body;
            const { USER_ID } = req.user.data;

            // check spam
            const sql_checkSpam = `SELECT a.MA_DG,a.NGAY_TAO
                                    FROM DANH_GIA a
                                    WHERE 
                                        a.USER_ID = '${USER_ID}' AND a.MA_SP='${MA_SP}'
                                    ORDER BY a.NGAY_TAO DESC
                                    LIMIT 1`;
            let data_checkSpam = await executeQuery(sql_checkSpam);

            if (data_checkSpam.length > 0) {
                const distanceTime = (new Date().getTime() - new Date(data_checkSpam[0].NGAY_TAO).getTime()) / 1000;
                const isLessThan5Minute = distanceTime < 5 * 60;
                if (isLessThan5Minute) {
                    const availableTime = (5 * 60) - distanceTime;
                    console.log({ availableTime })
                    return res.status(400).json({ message: `Thao tác quá nhanh hãy thử lại sau ${availableTime > 60 ? Math.trunc(availableTime / 60) + " phút" : parseFloat(availableTime).toFixed(0) + ' giây'} nữa.` });
                }
            }
            const MA_DG = randomString();
            const sql = `INSERT INTO DANH_GIA(MA_DG, USER_ID, MA_SP, NOI_DUNG, SO_SAO) 
                                        VALUES ('${MA_DG}','${USER_ID}','${MA_SP}','${NOI_DUNG}','${SO_SAO}')`;
            await executeQuery(sql);
            res.json({ message: 'Cảm ơn bạn đã đánh giá.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_danhgias: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const isExist = await checkIsExist('DANH_GIA', 'MA_DG', danhgiaID);
            if (!isExist) return res.status(400).json({ message: "Đánh giá không tồn tại." });

            const sql = `UPDATE DANH_GIA SET ? WHERE MA_DG='${danhgiaID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật đánh giá thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_danhgias: async (req, res) => {
        try {
            const { danhgiaID } = req.params;
            const isExist = await checkIsExist('DANH_GIA', 'MA_DG', danhgiaID);
            if (!isExist) return res.status(400).json({ message: "Đánh giá không tồn tại." });

            const sql = `DELETE FROM DANH_GIA WHERE MA_DG='${danhgiaID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa đánh giá thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}