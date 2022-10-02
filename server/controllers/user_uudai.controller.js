const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_user_uudais: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const { USER_ID } = req.user.data;
            const sql = `SELECT * FROM USER_UU_DAI a, UU_DAI b WHERE a.MA_UU_DAI=b.MA_UU_DAI AND a.USER_ID='${USER_ID}'`;
            console.log({ sql })
            const user_uudais = await executeQuery(sql);
            const sql_count = `SELECT COUNT(a.MA_UU_DAI) as total FROM USER_UU_DAI a, UU_DAI b WHERE a.MA_UU_DAI=b.MA_UU_DAI AND a.USER_ID='${USER_ID}'`;
            const data = await executeQuery(sql_count);

            res.json({
                result: user_uudais,
                totalRecord: data[0].total,
                message: 'Thành công'
            });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_user_uudais: async (req, res) => {
        try {
            const { MA_UU_DAI } = req.body;
            const { USER_ID } = req.user.data;
            const sql = `INSERT INTO USER_UU_DAI(MA_UU_DAI,USER_ID) 
                                        VALUES ('${MA_UU_DAI}','${USER_ID}')`;
            await executeQuery(sql);
            res.json({ message: 'Lưu voucher thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}