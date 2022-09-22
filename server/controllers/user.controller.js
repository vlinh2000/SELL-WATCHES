const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow, hashString, compareString, generateToken, generateRefreshToken } = require("../utils/global");


module.exports = {
    get_users: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * FROM USER ORDER BY NGAY_TAO DESC ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}`;
            const users = await executeQuery(sql);

            const sql_count = `SELECT COUNT(USER_ID) as total FROM USER`;
            const data = await executeQuery(sql_count);

            res.json({
                result: users,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_user: async (req, res) => {
        try {
            const { userID } = req.params;
            const sql = `SELECT * FROM USER WHERE USER_ID='${userID}'`;
            const users = await executeQuery(sql);
            res.json({
                result: users[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_users: async (req, res) => {
        try {
            const { HO_TEN, SO_DIEN_THOAI, EMAIL, DIA_CHI, GIOI_TINH, MAT_KHAU } = req.body;
            const isExist = await checkIsExist('USER', 'EMAIL', EMAIL);
            if (isExist) return res.status(400).json({ message: "Email đã được sử dụng." });

            const USER_ID = 'USER_' + randomString();
            const MAT_KHAU_HASHED = await hashString(MAT_KHAU);
            const sql = `INSERT INTO USER(USER_ID,HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, DIA_CHI, GIOI_TINH, MAT_KHAU) 
            VALUES ('${USER_ID}','${HO_TEN}','${SO_DIEN_THOAI}','${EMAIL}','','${DIA_CHI}','${GIOI_TINH}','${MAT_KHAU_HASHED}')`;
            await executeQuery(sql);
            res.json({ message: 'Đăng ký tài khoản thành công.' });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_users: async (req, res) => {
        try {
            const { userID } = req.params;
            const { USER_ID: authorId } = req.user.data;

            const isExist = await checkIsExist('USER', 'USER_ID', userID);
            if (!isExist) return res.status(400).json({ message: "Người dùng không tồn tại." });
            else if (authorId !== userID) return res.status(400).json({ message: "Chỉ có thể cập nhật thông tin cho bản thân." });

            let data = { ...req.body, CAP_NHAT: getNow() };
            const avatarUrl = req.file?.path;
            if (avatarUrl) data = { ...data, ANH_DAI_DIEN: avatarUrl }

            const sql = `UPDATE USER SET ? WHERE USER_ID='${userID}'`;
            await executeUpdateQuery(sql, data);

            res.json({ message: 'Cập nhật người dùng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    delete_users: async (req, res) => {
        try {
            const { userID } = req.params;
            const isExist = await checkIsExist('USER', 'USER_ID', userID);
            if (!isExist) return res.status(400).json({ message: "Người dùng không tồn tại." });

            const sql = `DELETE FROM USER WHERE USER_ID='${userID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa người dùng thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    login_users: async (req, res) => {
        try {
            const { EMAIL, MAT_KHAU } = req.body;
            let user;
            let response;
            const isExist = await checkIsExist('USER', `LOAI_TAI_KHOAN = 'tao_moi' AND EMAIL`, EMAIL);
            if (!isExist) {
                const isExist_employee = await checkIsExist('NHAN_VIEN', 'EMAIL', EMAIL);
                if (!isExist_employee) return res.status(400).json({ message: "Tài khoản không tồn tại." });
                const sql = `SELECT * FROM NHAN_VIEN a, CHUC_VU b WHERE a.EMAIL='${EMAIL}' AND a.MA_CV = b.MA_CV`;
                response = await executeQuery(sql);
            } else {
                const sql = `SELECT * FROM USER WHERE EMAIL='${EMAIL}'`;
                response = await executeQuery(sql);
            }
            user = response[0];
            console.log({ user });
            if (user.BI_KHOA == '1') return res.status(400).json({ message: `Tài khoản [${EMAIL}] đã bị khóa.` });

            const isValid = await compareString(MAT_KHAU, user.MAT_KHAU)
            if (!isValid) return res.status(400).json({ message: `Email hoặc mật khẩu không chính xác.` });

            const token = await generateToken(user);
            const refreshToken = await generateRefreshToken(user);

            res.json({ message: 'Đăng nhập thành công.', result: { token, refreshToken } });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_me: async (req, res) => {
        try {
            const { USER_ID, NV_ID } = req.user.data;
            const sql = USER_ID ? `SELECT * FROM USER WHERE USER_ID='${USER_ID}'` : `SELECT * FROM NHAN_VIEN a, CHUC_VU b WHERE a.NV_ID='${NV_ID}' AND a.MA_CV = b.MA_CV`;
            const data = await executeQuery(sql);

            res.json({
                result: data[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_new_token: async (req, res) => {
        try {
            const { USER_ID } = req.user.data;
            const sql = `SELECT * FROM USER WHERE USER_ID='${USER_ID}'`;
            const data = await executeQuery(sql);
            const token = await generateToken(data[0]);
            const refreshToken = await generateRefreshToken(data[0]);
            res.json({
                result: { token, refreshToken },
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    save_userInfo_WithSocialMedia: async (req, res) => {
        try {
            const { HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, LOAI_TAI_KHOAN } = req.body;
            const isExist = await checkIsExist('USER', `LOAI_TAI_KHOAN != 'tao_moi' AND EMAIL`, EMAIL);
            let sql;
            if (isExist) {
                sql = `UPDATE USER SET ? WHERE LOAI_TAI_KHOAN != 'tao_moi' AND EMAIL='${EMAIL}'`;
                await executeUpdateQuery(sql, { HO_TEN, SO_DIEN_THOAI, ANH_DAI_DIEN, LOAI_TAI_KHOAN, CAP_NHAT: getNow() });
            } else {
                const USER_ID = 'USER_' + randomString();
                sql = `INSERT INTO USER(USER_ID,HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN,LOAI_TAI_KHOAN) VALUES ('${USER_ID}','${HO_TEN}','${SO_DIEN_THOAI}','${EMAIL}','${ANH_DAI_DIEN}','${LOAI_TAI_KHOAN}')`;
                await executeQuery(sql);
            }

            const sql_getInfo = `SELECT * FROM USER WHERE LOAI_TAI_KHOAN != 'tao_moi' AND EMAIL='${EMAIL}'`;
            const data = await executeQuery(sql_getInfo);
            const user = data[0];
            console.log({ sql_getInfo, user });
            const token = await generateToken(user);
            const refreshToken = await generateRefreshToken(user);

            res.json({ message: 'Lưu tài khoản thành công.', result: { token, refreshToken } });

        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}