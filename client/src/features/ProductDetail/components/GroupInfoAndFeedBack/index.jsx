import React from 'react';
import PropTypes from 'prop-types';
import './GroupInfoAndFeedBack.scss';
import { Col, Form, Pagination, Rate, Row, Select, Tabs } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import { Link } from 'react-router-dom';
import FeedBackList from '../FeedBackList';
import SelectField from 'custom-fields/SelectField';
import SortBy from 'components/SortBy';

GroupInfoAndFeedBack.propTypes = {

};

function GroupInfoAndFeedBack(props) {

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div className='group-info-and-feedback'>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <Tabs.TabPane tab="Thông tin bổ sung & Chính sách bảo hành" key="1">
                    <Row justify='space-between'>
                        <Col xs={24} sm={24} md={12} lg={11}>
                            <ul className="group-info">
                                <li className="group-info-item">
                                    <span className='info-name'>bộ máy & năng lượng</span>
                                    <span className='info-value'>Cơ (Automatic)</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>CHẤT LIỆU DÂY</span>
                                    <span className='info-value'>Dây Kim Loại</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>CHẤT LIỆU MẶT KÍNH</span>
                                    <span className='info-value'>Kính Sapphire</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>GIỚI TÍNH</span>
                                    <span className='info-value'>Nữ</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>HÌNH DẠNG MẶT SỐ</span>
                                    <span className='info-value'>Tròn</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>KÍCH THƯỚC MẶT SỐ</span>
                                    <span className='info-value'>&lt; 29 mm</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>MÀU MẶT SỐ</span>
                                    <span className='info-value'>Trắng</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>MỨC CHỐNG NƯỚC</span>
                                    <span className='info-value'>Đi Mưa Nhỏ (3 ATM)</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>THƯƠNG HIỆU</span>
                                    <span className='info-value'>Tissot</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>XUẤT XỨ</span>
                                    <span className='info-value'>Thụy Sĩ</span>
                                </li>

                            </ul>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <p className='category-name'>Chính sách bảo hành của riêng mỗi hãng:</p>
                            <ul className='list-info'>

                                <li>
                                    CASIO: Bảo hành chính hãng máy 1 năm, pin 1,5 năm</li>
                                <li>
                                    CITIZEN: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>

                                <li>
                                    SEIKO: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    ORIENT: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    OP: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                                <li>
                                    RHYTHM: Bảo hành chính hãng máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    OGIVAL: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                                <li>
                                    ELLE: Bảo hành chính hãng máy 2 năm, pin 2 năm
                                </li>
                                <li>
                                    TISSOT: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Đánh giá (0)" key="2">
                    <div className="feedback-wrapper">
                        <div className="total-feedback-wrapper">
                            <div className='total-feedback'><span className='total-score'>4.7</span> <Rate disabled defaultValue={5} /></div>
                            <div className='feedback-item-vote'><span className='num-star'>5</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: "50%" }}></span></span> <span className='percent-vote'>50%</span></div>
                            <div className='feedback-item-vote'><span className='num-star'>4</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: "20%" }}></span></span><span className='percent-vote'>20%</span></div>
                            <div className='feedback-item-vote'><span className='num-star'>3</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: "10%" }}></span></span><span className='percent-vote'>10%</span></div>
                            <div className='feedback-item-vote'><span className='num-star'>2</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: "20%" }}></span></span><span className='percent-vote'>20%</span></div>
                            <div className='feedback-item-vote'><span className='num-star'>1</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: "0%" }}></span></span><span className='percent-vote'>0%</span></div>
                        </div>
                        <div className='feedback-list-wrapper'>
                            <SortBy
                                style={{ width: 150 }}
                                label="Sắp xếp theo"
                                name="sortBy"
                                options={[
                                    { label: 'Mới nhất', value: 'new', },
                                    { label: 'Cũ nhất', value: 'old', },
                                    { label: 'Đánh giá cao', value: 'high', },
                                    { label: 'Đánh giá thấp', value: 'low', },
                                ]} />
                            <FeedBackList />
                            <Pagination defaultCurrent={1} total={50} />
                        </div>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Viết đánh giá" key="3">
                    <div className="feedback-wrapper">
                        <div className='my-feedback'>
                            <p>Vui lòng <Link to="">đăng nhập</Link> để đánh giá</p>
                            <Form className="form-feedback" layout='vertical'>
                                <div className="vote">
                                    <div className='label'>Đánh giá của bạn</div>
                                    <Rate count={5} />
                                </div>
                                <div className="comments">
                                    <InputField name="comment" label="Nhận xét của bạn" type="textarea" />
                                </div>
                                <Row gutter={[20, 0]}>
                                    <Col xs={24} sm={12} md={12} lg={12}>
                                        <InputField name="name" label="Tên" />
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={12}>
                                        <InputField name="email" label="Email" />
                                    </Col>
                                </Row>
                            </Form>
                            <ButtonCustom text="Gửi" />
                        </div>
                    </div>
                </Tabs.TabPane>

            </Tabs>
        </div >
    );
}

export default GroupInfoAndFeedBack;