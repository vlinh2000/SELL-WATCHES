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
    },
    TEMPLATE_GIVE_VOUCHER: (voucherList, moreContent) => {
        return `
                <head>
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

                        ul,
                        ol {
                            margin-top: 5px;
                            padding-left: 20px;
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
                            <div>
                                Hiện tại cửa hàng đang có chương trình tặng voucher khuyến mãi để tri ân khách hàng Quý khách là một
                                trong những khách hàng thân thiết đặc biệt của chúng tôi.<br />
                                Cửa hàng của chúng tôi được thành công như ngày hôm nay đều là nhờ vào sự tin tưởng và ủng hộ của Quý khách.
                            </div>
                            ${moreContent ? `<div>${moreContent}.</div>` : ''
            }
                            <br />
                            <img
                                src="https://res.cloudinary.com/vlinh/image/upload/v1664806783/images-tieuluan/tri-an-khach-hang_wgyzh2.png" />
                            <br />
                            <br />
                            Danh sách voucher bao gồm:
                            <ol>
                                ${voucherList?.map(v => `<li>${v}</li>`).join("")}
                            </ol>
                            <p><i>Lưu ý</i>: Chương trình chỉ áp dụng đối với khách hàng nhận được mail này của chúng tôi.</p>
                        </div>
                    </div>
                </body>`
    }

}
