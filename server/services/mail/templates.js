module.exports = {
    TEMPLATE_FORGET_PASSWORD: (text) => {
        return `<head>
                    <style>
                        body {
                            margin: 0;
                        }
                
                        .wrapper {
                            width: 100vw;
                        }
                
                        .header {
                            display: block;
                            background-color: #333333;
                            padding: 5px 10px;
                        }
                
                        .logo {
                            width: 100px;
                            height: 30px;
                
                        }
                
                        .main {
                            padding: 10px;
                        }
                
                        a {
                            white-space: wrap;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="wrapper">
                        <div class="header">
                            <img class="logo"
                                src="https://res.cloudinary.com/vlinh/image/upload/v1664697926/images-tieuluan/logo_qezu3u.png" />
                        </div>
                        <div class="main">
                            <p>Mona Store xin chào,</p>
                            <div>Chúng tôi vừa nhận được yêu cầu khôi phục mật khẩu trong hệ thống monastore đối với tài khoản của bạn.
                                Bạn vui lòng nhấp vào link bên dưới để tiến hành thay đổi mật khẩu cho tài khoản.
                            </div>
                            <br />
                            <a target="_blank" href='${text}'>${text}</a>
                            <p><i>Lưu ý</i>: link khôi phục mật khẩu chỉ có hiệu lực trong 5 phút.</p>
                        </div>
                    </div>
                </body>`
    }

}
