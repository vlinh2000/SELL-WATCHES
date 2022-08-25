const express = require('express')
var bodyParser = require("body-parser");
const app = express()
const port = 8000
const { con } = require('./mysql');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nhanvienRouter = require('./routes/nhanvien.route');

/*---CONNECT DATABASE---*/

con.connect(function (err) {
    if (err) throw err;
    console.log("Connect database successfully !");
});

/*---ROUTES---*/

app.use('/api/nhanviens', nhanvienRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})