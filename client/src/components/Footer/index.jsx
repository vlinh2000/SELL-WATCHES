import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'antd';
import './Footer.scss';
import { EnvironmentOutlined, FacebookFilled, FacebookOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

Footer.propTypes = {

};

function Footer(props) {
    return (
        <div className='footer'>
            <div className="footer__main">
                <Row>
                    <Col className="footer-col" xs={24} sm={24} md={12} lg={6}>
                        <h1>Tổng đài</h1>
                        <ul>
                            <li>
                                Gọi mua:&nbsp;<strong>1800.1060&nbsp;</strong>(7:30 - 22:00)
                            </li>
                            <li>
                                Kỹ thuật:&nbsp;<strong>1800.1061&nbsp;</strong>(7:30 - 22:00)
                            </li>
                            <li>
                                Khiếu nại:&nbsp;<strong>1800.1062&nbsp;</strong>(8:00 - 21:30)
                            </li>
                            <li>
                                Bảo hành:&nbsp;<strong>1800.1063&nbsp;</strong>(8:00 - 21:00)
                            </li>
                            <li>
                                Tư vấn:&nbsp;<strong>1800.1064&nbsp;</strong>(8:00 - 22:00)
                            </li>
                        </ul>
                    </Col>

                    <Col className="footer-col" xs={24} sm={24} md={12} lg={5}>
                        <h1>Liên kết</h1>
                        <ul>
                            <li>
                                <Link to="">Giới thiệu</Link>
                            </li>
                            <li>
                                <Link to="">Đồng hồ nam</Link>
                            </li>
                            <li>
                                <Link to="">Đồng hồ nữ</Link>
                            </li>
                            <li>
                                <Link to="">Blogs</Link>
                            </li>
                            <li>
                                <Link to="">Liên hệ</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col className="footer-col" xs={24} sm={24} md={12} lg={6}>
                        <h1>Hổ trợ</h1>
                        <ul>
                            <li>
                                <Link to="">Hướng dẫn mua hàng</Link>
                            </li>
                            <li>
                                <Link to="">Hướng dẫn thanh toán</Link>
                            </li>
                            <li>
                                <Link to="">Chính sách bảo hành</Link>
                            </li>
                            <li>
                                <Link to="">Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link to="">Tư vấn khách hàng</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col className="footer-col" xs={24} sm={24} md={12} lg={7}>
                        <h1>Thông tin liên hệ</h1>
                        <ul>
                            <li>
                                <EnvironmentOutlined className='icon' /> <span className='content'>319 C16 Lý Thường Kiệt, Phường 15, Quận 11,Tp.HCM</span>
                            </li>
                            <li>
                                <PhoneOutlined className='icon' /> <span className="content">076 922 0162</span>
                            </li>
                            <li>
                                <MailOutlined className='icon' /> <span className="content">demonhunterg@gmail.common@mona.media</span>
                            </li>
                            <li className='list-icon'>
                                <Button icon={<FacebookFilled />} shape="circle" />
                                <Button icon={<InstagramOutlined />} shape="circle" />
                                <Button icon={<TwitterOutlined />} shape="circle" />
                                {/* <Button icon={<FacebookOutlined />} shape="circle" /> */}
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Footer;