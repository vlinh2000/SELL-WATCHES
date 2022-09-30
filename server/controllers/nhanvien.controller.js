const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { randomString, getNow, generateToken, generateRefreshToken, hashString } = require("../utils/global");

module.exports = {
    get_nhanviens: async (req, res) => {
        try {
            const { _limit, _page } = req.query;
            const sql = `SELECT * 
                         FROM NHAN_VIEN a, CHUC_VU b
                         WHERE a.MA_CV = b.MA_CV 
                         ORDER BY a.NGAY_TAO DESC
                         ${(_page && _limit) ? ' LIMIT ' + _limit + ' OFFSET ' + _limit * (_page - 1) : ''}
                         `;
            const sql_count = `SELECT COUNT(NV_ID) as total FROM NHAN_VIEN a, CHUC_VU b WHERE a.MA_CV = b.MA_CV `;
            const data = await executeQuery(sql_count);

            const nhanviens = await executeQuery(sql);
            res.json({
                result: nhanviens,
                totalRecord: data[0].total,
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_nhanvien: async (req, res) => {
        try {
            const { nhanvienID } = req.params;
            const sql = `SELECT * FROM NHAN_VIEN WHERE NV_ID='${nhanvienID}'`;
            const nhanviens = await executeQuery(sql);
            res.json({
                result: nhanviens[0],
                message: 'Thành công'
            });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    post_nhanviens: async (req, res) => {
        try {
            const { HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, DIA_CHI, GIOI_TINH, MA_CV } = req.body;
            let { QUYEN, MAT_KHAU } = req.body;
            QUYEN = JSON.parse(QUYEN);
            const avatarUrl = req.file?.path || ANH_DAI_DIEN;
            MAT_KHAU = await hashString(MAT_KHAU);

            const NV_ID = 'NV_' + randomString();
            const sql = `INSERT INTO NHAN_VIEN(NV_ID,MA_CV,HO_TEN,SO_DIEN_THOAI,EMAIL,ANH_DAI_DIEN,DIA_CHI,GIOI_TINH,MAT_KHAU) 
                                        VALUES ('${NV_ID}','${MA_CV}','${HO_TEN}','${SO_DIEN_THOAI}','${EMAIL}','${avatarUrl || ""}','${DIA_CHI}','${GIOI_TINH}','${MAT_KHAU}')`;
            await executeQuery(sql);

            const processes = QUYEN?.map((ma_quyen) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_newRule = `INSERT INTO QUYEN_NHAN_VIEN(MA_QUYEN,NV_ID) VALUES ('${ma_quyen}','${NV_ID}')`
                        await executeQuery(sql_newRule);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                })
            })

            await Promise.all(processes);
            res.json({ message: 'Thêm nhân viên thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_nhanviens: async (req, res) => {
        try {
            const { nhanvienID } = req.params;
            const { HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, DIA_CHI, GIOI_TINH, MA_CV } = req.body;
            let { QUYEN, MAT_KHAU } = req.body;
            QUYEN = JSON.parse(QUYEN);
            MAT_KHAU = MAT_KHAU.includes('$') ? MAT_KHAU : await hashString(MAT_KHAU);

            const isExist = await checkIsExist('NHAN_VIEN', 'NV_ID', nhanvienID);
            if (!isExist) return res.status(400).json({ message: "Nhân viên không tồn tại." });
            // else if (authorId !== userID) return res.status(400).json({ message: "Chỉ có thể cập nhật thông tin cho bản thân." });

            let data = { HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, DIA_CHI, GIOI_TINH, MAT_KHAU: MAT_KHAU, MA_CV, CAP_NHAT: getNow() };

            const avatarUrl = req.file?.path;
            if (avatarUrl) data = { ...data, ANH_DAI_DIEN: avatarUrl }

            const sql = `UPDATE NHAN_VIEN SET ? WHERE NV_ID='${nhanvienID}'`;
            await executeUpdateQuery(sql, data);

            const sql_resetRules = `DELETE FROM QUYEN_NHAN_VIEN WHERE NV_ID='${nhanvienID}'`
            await executeQuery(sql_resetRules);

            const processes = QUYEN?.map((ma_quyen) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const sql_newRule = `INSERT INTO QUYEN_NHAN_VIEN(MA_QUYEN,NV_ID) VALUES ('${ma_quyen}','${nhanvienID}')`
                        await executeQuery(sql_newRule);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                })
            })

            await Promise.all(processes);
            res.json({ message: 'Cập nhật nhân viên thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    get_new_token: async (req, res) => {
        try {
            const { NV_ID } = req.user.data;
            const sql = `SELECT * FROM NHAN_VIEN a, CHUC_VU b WHERE a.NV_ID='${NV_ID}' AND a.MA_CV = b.MA_CV`;
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
    delete_nhanviens: async (req, res) => {
        try {
            const { nhanvienID } = req.params;
            const isExist = await checkIsExist('NHAN_VIEN', 'NV_ID', nhanvienID);
            if (!isExist) return res.status(400).json({ message: "Nhân viên không tồn tại." });

            const sql = `DELETE FROM NHAN_VIEN WHERE NV_ID='${nhanvienID}'`;
            await executeQuery(sql);

            res.json({ message: 'Xóa nhân viên thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}