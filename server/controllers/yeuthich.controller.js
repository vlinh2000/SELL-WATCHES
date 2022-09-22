const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString } = require("../utils/global");

module.exports = {
    get_yeuthichs: async (req, res) => {
        try {
            const sql = `SELECT a.MA_YEU_THICH,a.MA_SP,b.TEN_SP,b.GIA_BAN,b.SO_LUONG,c.HINH_ANH 
                        FROM YEU_THICH a, SAN_PHAM b,ANH_SAN_PHAM c 
                        WHERE a.USER_ID='${req.user.data.USER_ID}' 
                            AND a.MA_SP=b.MA_SP 
                            AND c.MA_SP=b.MA_SP`;
            const yeuthichs = await executeQuery(sql);
            res.json({
                result: yeuthichs,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_yeuthich: async (req, res) => {
        try {
            const { yeuthichID } = req.params;
            const sql = `SELECT * FROM YEU_THICH WHERE MA_YEU_THICH='${yeuthichID}'`;
            const yeuthichs = await executeQuery(sql);
            res.json({
                result: yeuthichs[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_yeuthichs: async (req, res) => {
        try {
            const { MA_SP } = req.body;
            const MA_YEU_THICH = 'YT_' + randomString();

            const sql = `INSERT INTO YEU_THICH(MA_YEU_THICH, USER_ID, MA_SP) 
                                        VALUES ('${MA_YEU_THICH}','${req.user.data.USER_ID || req.user.data.NV_ID}','${MA_SP}')`;
            console.log({ sql, user: req.user })
            await executeQuery(sql);
            res.json({ message: 'Đã thêm vào danh sách yêu thích.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_yeuthichs: async (req, res) => {
        try {
            const { yeuthichID } = req.params;
            const isExist = await checkIsExist('YEU_THICH', 'MA_YEU_THICH', yeuthichID);
            if (!isExist) return res.status(400).json({ message: "Yêu thích không tồn tại." });

            const sql = `UPDATE YEU_THICH SET ? WHERE MA_YEU_THICH='${yeuthichID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật yêu thích thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_yeuthichs: async (req, res) => {
        try {
            const { sanphamID } = req.params;
            const isExist = await checkIsExist('YEU_THICH', `USER_ID='${req.user.data.USER_ID}' AND MA_SP`, sanphamID);
            if (!isExist) return res.status(400).json({ message: "Yêu thích không tồn tại." });

            const sql = `DELETE FROM YEU_THICH WHERE USER_ID='${req.user.data.USER_ID}' AND MA_SP='${sanphamID}'`;
            await executeQuery(sql);

            res.json({ message: 'Đã gỡ sản phẩm này khỏi danh sách yêu thích.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}