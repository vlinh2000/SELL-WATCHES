const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
const { con } = require('./mysql');
require('dotenv').config();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nhanvienRouter = require('./routes/nhanvien.route');
const chucvuRouter = require('./routes/chucvu.route');
const danhmucRouter = require('./routes/danhmuc.route');
const loaisanphamRouter = require('./routes/loaisanpham.route');
const diachighRouter = require('./routes/diachigh.route');
const thuonghieuRouter = require('./routes/thuonghieu.route');
const danhgiaRouter = require('./routes/danhgia.route');
const phieunhapRouter = require('./routes/phieunhap.route');
const donhangRouter = require('./routes/donhang.route');
const nhacungcapRouter = require('./routes/nhacungcap.route');
const phanhoiRouter = require('./routes/phanhoi.route');
const quyenRouter = require('./routes/quyen.route');
const sanphamRouter = require('./routes/sanpham.route');
const userRouter = require('./routes/user.route');
const yeuthichRouter = require('./routes/yeuthich.route');


/*---CONNECT DATABASE---*/

con.connect(function (err) {
    if (err) throw err;
    console.log("Connect database successfully !");
});

/*---ROUTES---*/

app.use('/api/nhanviens', nhanvienRouter);
app.use('/api/chucvus', chucvuRouter);
app.use('/api/danhmucs', danhmucRouter);
app.use('/api/loaisanphams', loaisanphamRouter);
app.use('/api/diachighs', diachighRouter);
app.use('/api/thuonghieus', thuonghieuRouter);
app.use('/api/phieunhaps', phieunhapRouter);
app.use('/api/danhgias', danhgiaRouter);
app.use('/api/donhangs', donhangRouter);
app.use('/api/nhacungcaps', nhacungcapRouter);
app.use('/api/phanhois', phanhoiRouter);
app.use('/api/quyens', quyenRouter);
app.use('/api/sanphams', sanphamRouter);
app.use('/api/nguoidungs', userRouter);
app.use('/api/yeuthichs', yeuthichRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})