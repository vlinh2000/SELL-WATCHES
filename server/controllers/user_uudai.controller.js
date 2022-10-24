const { executeQuery, checkIsExist, executeUpdateQuery } = require("../mysql");
const { sendMail } = require("../services/mail/mail");
const { TEMPLATE_GIVE_VOUCHER } = require("../services/mail/templates");
const { randomString } = require("../utils/global");
const moment = require('moment');

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
            const { MA_UU_DAI, action, OPT_DS_USER, NOI_DUNG, DS_VOUCHER } = req.body;
            let { DS_USER } = req.body;
            const { USER_ID } = req.user.data;

            // console.log(req.body);
            if (action === 'give-voucher') {
                console.log("start")
                if (OPT_DS_USER === 'allUser') {
                    const sql_getAllUser = `SELECT USER_ID,EMAIL FROM USER WHERE BI_KHOA=0`;
                    DS_USER = await executeQuery(sql_getAllUser);
                }
                const processes = DS_USER.map(u => {
                    const user = u.USER_ID ? u : JSON.parse(u);
                    console.log({ user })
                    return new Promise(async (resolve, reject) => {
                        try {
                            const note = [];
                            const subProcess_saveVoucher = DS_VOUCHER.map((v, idx) => {
                                return new Promise(async (resolveSub, rejectSub) => {
                                    try {
                                        const voucher = JSON.parse(v);
                                        note.push(`Voucher ${voucher.TEN_UU_DAI} ~ HSD:${moment(voucher.HSD).format('DD-MM-YYYY HH:mm:ss')}`);
                                        const isExist = await checkIsExist('USER_UU_DAI', `USER_ID='${user.USER_ID}' AND MA_UU_DAI`, voucher.MA_UU_DAI);
                                        if (!isExist) {
                                            const sql_save = `INSERT INTO USER_UU_DAI(MA_UU_DAI,USER_ID) VALUES ('${voucher.MA_UU_DAI}','${user.USER_ID}')`
                                            await executeQuery(sql_save);
                                        }
                                        console.log("USER" + user.USER_ID + " OK: " + voucher.MA_UU_DAI)
                                        resolveSub(true);
                                    } catch (error) {
                                        rejectSub(error);
                                    }
                                })

                            })

                            // save user_uudai
                            await Promise.all(subProcess_saveVoucher);
                            // send_mail;
                            await sendMail(user.EMAIL, 'Chương trình khuyến mãi tri ân khách hàng', TEMPLATE_GIVE_VOUCHER(note, NOI_DUNG || ''));
                            console.log("USER" + user.USER_ID + " SEND MAIL: OK")
                            resolve(true);
                        } catch (error) {
                            reject(error);
                        }
                    })
                })

                await Promise.all(processes);
                return res.json({ message: "Tặng voucher thành công." });
            }
            const sql = `INSERT INTO USER_UU_DAI(MA_UU_DAI,USER_ID) 
                                        VALUES ('${MA_UU_DAI}','${USER_ID}')`;
            await executeQuery(sql);
            res.json({ message: 'Lưu voucher thành công.' });
        } catch (error) {
            console.log({ error });
            res.status(500).json({ message: "Đã xảy ra lỗi! Hãy thử lại sau." })
        }
    },
}