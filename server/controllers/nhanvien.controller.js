const { executeQuery, checkExist, checkIsExist, executeUpdateQuery } = require("../mysql");
const { MA_CV_MAC_DINH } = require("../routes/commonConstants");
const { randomString, getNow } = require("../utils/global");

module.exports = {
    get_nhanviens: async (req, res) => {
        try {
            const sql = `SELECT * FROM NHAN_VIEN`;
            const nhanviens = await executeQuery(sql);
            res.json({
                result: nhanviens,
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
            const { HO_TEN, SO_DIEN_THOAI, EMAIL, ANH_DAI_DIEN, DIA_CHI, GIOI_TINH, MAT_KHAU, MA_CV } = req.body;
            const NV_ID = randomString();
            const sql = `INSERT INTO NHAN_VIEN(NV_ID,MA_CV,HO_TEN,SO_DIEN_THOAI,EMAIL,ANH_DAI_DIEN,DIA_CHI,GIOI_TINH,MAT_KHAU) 
                                        VALUES ('${NV_ID}','${MA_CV}','${HO_TEN}','${SO_DIEN_THOAI}','${EMAIL}','${ANH_DAI_DIEN}','${DIA_CHI}','${GIOI_TINH}','${MAT_KHAU}')`;
            await executeQuery(sql);
            res.json({ message: 'Thêm nhân viên thành công.' });
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
    patch_nhanviens: async (req, res) => {
        try {
            const { nhanvienID } = req.params;
            const isExist = await checkIsExist('NHAN_VIEN', 'NV_ID', nhanvienID);
            if (!isExist) return res.status(400).json({ message: "Nhân viên không tồn tại." });

            req.body.CAP_NHAT = getNow();

            const sql = `UPDATE NHAN_VIEN SET ? WHERE NV_ID='${nhanvienID}'`;
            await executeUpdateQuery(sql, { ...req.body });

            res.json({ message: 'Cập nhật nhân viên thành công.' });
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