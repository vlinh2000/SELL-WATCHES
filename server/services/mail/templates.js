module.exports = {
    TEMPLATE_FORGET_PASSWORD: (text) => {
        return `<head>
                    <style>
                        .container {
                            width: 60%;
                            margin: 0 auto;
                        }
                
                        .wrapper {
                            background: #FFF;
                            font-size: 13px;
                        }
                
                        .header {
                            display: block;
                            background-color: #75c9b7;
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
                
                <div class="container">
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
                </div>`
    },
    TEMPLATE_GIVE_VOUCHER: (voucherList, moreContent) => {
        return `
                <head>
                    <style>
                    .container {
                        width: 60%;
                        margin: 0 auto;
                    }
                    
                    .wrapper-mail {
                        background: #FFF;
                        font-size: 12px;
                    }
        
                    .header {
                        display: block;
                        background-color: #75c9b7;
                        padding: 5px 10px;
                    }

                    h4{
                        margin: 5px 0;
                    }
        
                    .main-image{
                        height: 200px;    
                    }
                    
                    .main-image img{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
        
                    .logo {
                        width: 100px;
                        height: 30px;
                    }
        
                    .main {
                        padding: 10px;
                    }
        
                    .main-content{
                        margin-bottom: 5px;
                    }
        
                    ul,
                    ol {
                        margin-top: 5px;
                        padding-left: 20px;
                    }
                    </style>
                </head>

                <div class="container">
                    <div class="wrapper-mail">
                        <div class="header">
                            <img class="logo"
                                src="https://res.cloudinary.com/vlinh/image/upload/v1664697926/images-tieuluan/logo_qezu3u.png" />
                        </div>
                        <div class="main">
                            <h4>Mona Store xin chào,</h4>
                            <div class="main-content">
                                Hiện tại cửa hàng đang có chương trình tặng voucher khuyến mãi để tri ân khách hàng Quý khách là một
                                trong những khách hàng thân thiết đặc biệt của chúng tôi.<br />
                                Cửa hàng của chúng tôi được thành công như ngày hôm nay đều là nhờ vào sự tin tưởng và ủng hộ của Quý khách.
                            </div>
                            <div>${moreContent}.</div>
                            <br />
                            <div class="main-image">
                                <img
                                    src="https://res.cloudinary.com/vlinh/image/upload/v1666423702/images-tieuluan/giftvoucher-600x533_bszoin.jpg" />
                            </div>
                            <br />
                            <br />
                            Danh sách voucher bao gồm:
                            <ol>
                                ${voucherList?.map(v => `<li>${v}</li>`).join("")}
                            </ol>
                            <p><i>Lưu ý</i>: Chương trình chỉ áp dụng đối với khách hàng nhận được mail này của chúng tôi.</p>
                        </div>
                    </div>
                </div>`
    },

    TEMPLATE_ORDER_SUCCESS: (order) => {

        return `
                <head>
                    <style>
                        .container {
                            width: 60%;
                            margin: 0 auto;
                        }

                        .wrapper-mail {
                            background: #FFF;
                            font-size: 12px;
                        }

                        .header {
                            display: block;
                            background-color: #75c9b7;
                            padding: 5px 10px;
                        }

                        h4 {
                            margin: 5px 0;
                        }

                        .main-image {
                            height: 100px;
                        }

                        .main-image img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }

                        .logo {
                            width: 100px;
                            height: 30px;
                        }

                        .main {
                            padding: 10px;
                        }

                        .main-content {
                            margin-top:10px;
                            margin-bottom: 5px;
                            line-height: 20px;
                        }

                        .total-price {
                            font-size: 14px;
                        }

                        .detail-list {
                            margin-top: 5px;
                        }

                        ul,
                        ol {
                            margin-top: 5px;
                            padding-left: 20px;
                        }
                    </style>
                </head>

                <div class="container">
                    <div class="wrapper-mail">
                        <div class="header">
                            <img class="logo"
                                src="https://res.cloudinary.com/vlinh/image/upload/v1664697926/images-tieuluan/logo_qezu3u.png" />
                        </div>
                        <div class="main">
                            <div class="main-content">
                                Bạn đã đặt thành công đơn hàng mã ${order.MA_DH}, trị giá <strong
                                    class="total-price">${order.TONG_TIEN}</strong>đ + phí ship <strong>${order.PHI_SHIP}</strong>đ
                                ${order.HINH_THUC_THANH_TOAN === 'cod' ? ' thanh toán khi nhận hàng' : ` đã thanh toán qua ${order.HINH_THUC_THANH_TOAN}`}.
                                Sau khi Shop xác nhận đơn hàng, sản phẩm sẽ được giao đến địa chỉ ${order.DIA_CHI}. <br />
                                <div class="detail-list">
                                    Chi tiết đơn hàng bao gồm:
                                    <ul>
                                     ${order.DS_SP?.map(sp => `<li>x${sp.SO_LUONG} ~ ${sp.TEN_SP}</li>`).join("")}
                                    </ul>
                                </div>
                                Mona Store rất hân hạnh được phục vụ bạn !<br />
                            </div>
                            <br />
                            <div class="main-image">
                                <img
                                    src="https://res.cloudinary.com/vlinh/image/upload/v1666610884/images-tieuluan/dat-hang-thanh-cong_zpriyo.jpg" />
                            </div>
                        </div>
                    </div>
                </div>
        `
    }

}
