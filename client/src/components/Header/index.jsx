import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Link } from 'react-router-dom';
import { Button, Col, Popover, Row, Tooltip } from 'antd'
import { BarsOutlined, CloseOutlined, EnvironmentOutlined, FacebookFilled, FacebookOutlined, HeartOutlined, InstagramOutlined, PhoneOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined, TwitterOutlined } from '@ant-design/icons';
import ButtonCustom from 'components/ButtonCustom';

Header.propTypes = {

};


function CartInfo(props) {
    return (
        <div className='cart-info'>
            <ul className="list-item">
                <li className="item">
                    <Row>
                        <Col className='item-image' span={6}>
                            <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-candino-c4433_3-nu-pin-day-inox-600x600-300x300.jpg' alt='image' />
                        </Col>
                        <Col className='item-info' span={14}>
                            <Link to="" className='item-name'>ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX </Link>
                            <span className='item-quantity-price'>1 x <strong>500,000&nbsp;₫</strong></span>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button size='small' icon={<CloseOutlined />} shape="circle" />
                        </Col>
                    </Row>
                </li>
                <li className="item">
                    <Row>
                        <Col className='item-image' span={6}>
                            <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-candino-c4433_3-nu-pin-day-inox-600x600-300x300.jpg' alt='image' />
                        </Col>
                        <Col className='item-info' span={14}>
                            <Link to="" className='item-name'>ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX </Link>
                            <span className='item-quantity-price'>1 x <strong>500,000&nbsp;₫</strong></span>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button size='small' icon={<CloseOutlined />} shape="circle" />
                        </Col>
                    </Row>
                </li>
                <li className="item">
                    <Row>
                        <Col className='item-image' span={6}>
                            <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-candino-c4433_3-nu-pin-day-inox-600x600-300x300.jpg' alt='image' />
                        </Col>
                        <Col className='item-info' span={14}>
                            <Link to="" className='item-name'>ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX </Link>
                            <span className='item-quantity-price'>1 x <strong>500,000&nbsp;₫</strong></span>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button size='small' icon={<CloseOutlined />} shape="circle" />
                        </Col>
                    </Row>
                </li>


                {/* not item in cart */}
                {/* <li>
                    <p style={{ color: '#777' }}>Chưa có sản phẩm trong giỏ hàng.</p>
                </li> */}
            </ul>
            <div className='item total-price'>
                <div>...</div>
                <strong className='total-price-title'>Tổng tiền:</strong> <strong className='total-price-num'>1.200.000&nbsp;₫</strong>
            </div>
            <Link className='btnCustom' style={{ backgroundColor: '#c89979' }} to="/b">Xem giỏ hàng</Link>
            <Link className='btnCustom' to="/a">Thanh toán</Link>
        </div>
    );
}


function Header(props) {

    const handleShowNavbar = () => {
        document.querySelector('.hide-bg').style.display = 'block';
        const navbar = document.querySelector('.header-wrapper__header__navbar');
        navbar.style.opacity = 1;
        navbar.style.visibility = 'visible';
        navbar.style.width = '50%';
    }

    const handleCloseNavbar = () => {
        document.querySelector('.hide-bg').style.display = 'none';
        const navbar = document.querySelector('.header-wrapper__header__navbar');
        navbar.style.opacity = 0;
        navbar.style.visibility = 'hidden';
        navbar.style.width = '0';

    }

    return (
        <div className='header-wrapper'>
            <div className="header-wrapper__header">
                <div className="header-wrapper__header__top-nav">
                    <div className="header-wrapper__header__top-nav__left">
                        <EnvironmentOutlined className='icon' />
                        <span className='address'>319 - C16 Lý Thường Kiệt, P.15, Q.11, Tp.HCM</span>
                        <PhoneOutlined className='icon' />
                        <span>076 922 1111</span>
                    </div>
                    <div className="header-wrapper__header__top-nav__right">
                        <Tooltip title="Follow on facebook">
                            <a href='https://facebook.com' target='_blank'>
                                <FacebookFilled />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Instagram">
                            <a href='https://instagram.com' target='_blank'>
                                <InstagramOutlined />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Twitter">
                            <a href='https://twitter.com' target='_blank'>
                                <TwitterOutlined />
                            </a>
                        </Tooltip>
                        <Link className='user' to="/">Đăng nhập/đăng ký</Link>
                    </div>
                </div>
                <div className="header-wrapper__header__main-nav">
                    <div className="logo">
                        <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='logo' />
                    </div>
                    <div className="search">
                        <form className='form-search'>
                            <input className='search-input' name='searchValue' type="text" placeholder="Tìm kiếm ..." />
                            <button className='btn-search' type='submit'>
                                <SearchOutlined />
                            </button>
                        </form>
                    </div>
                    <div className="right">
                        <div className="badge-custom">
                            <HeartOutlined className='icon' />
                            <span className='num'>5</span>
                        </div>
                        <Popover placement='bottomLeft' content={<CartInfo />} trigger="click">
                            <div className="card-custom">
                                <ShoppingOutlined className='icon' />
                                <span className='num'>2</span>
                            </div>
                        </Popover>
                        <BarsOutlined className="menu-custom" onClick={handleShowNavbar} />
                    </div>
                </div>
                <div className="header-wrapper__header__navbar">
                    <ul className='navbar-list'>
                        <li className="navbar-item">
                            <Link to="" className='active'>Trang Chủ</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="">Giới thiệu</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="">Đồng hồ nam</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="">Đồng hồ nữ</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="">Blogs</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="">Liên hệ</Link>
                        </li>
                        <li className="navbar-item user-logged">
                            <Link to="">Đăng nhập</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="hide-bg">
                <Button className='btn-close' onClick={handleCloseNavbar} icon={<CloseOutlined />} shape="circle"></Button>
            </div>
        </div>

    );
}

export default Header;