import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { EnvironmentFilled, MailOutlined, PhoneFilled } from '@ant-design/icons';
import './Contact.scss';

Contact.propTypes = {

};

function Contact(props) {
    return (
        <div className='wrapper-content'>
            <div className="contact">
                <iframe
                    width="100%"
                    height="300px"
                    frameborder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAP_API}&q=1%2F11k+Đường+Lý+Tự+Trọng,+Ninh+Kiều,+Cần+Thơ`}
                    allowfullscreen
                />

                <div className="shop-info">
                    <Row>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <div className="info-wrapper">
                                <div className="icon">
                                    <EnvironmentFilled />
                                </div>
                                <div className='info'>
                                    <p>Địa chỉ</p>
                                    <div>1/11B Đ. Lý Tự Trọng, An Lạc, Ninh Kiều, Cần Thơ</div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <div className="info-wrapper">
                                <div className="icon">
                                    <PhoneFilled />
                                </div>
                                <div className='info'>
                                    <p>Điện thoại</p>
                                    <i>1900 636 648</i>
                                    <div>Bấm 109 – Phòng kinh doanh</div>
                                    <div>Bấm 103 – Phòng kỹ thuật</div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <div className="info-wrapper">
                                <div className="icon">
                                    <MailOutlined />
                                </div>
                                <div className='info'>
                                    <p>Email</p>
                                    <div>demotieuluan@gmail.com</div>
                                    <div>linh@yahoo.media</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Contact;