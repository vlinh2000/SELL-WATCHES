import React from 'react';
import PropTypes from 'prop-types';
import { Col, Collapse, Form, Pagination, Row, Tabs, Tooltip } from 'antd';
import { AndroidOutlined, AppleOutlined, CameraOutlined, CarOutlined, HistoryOutlined, HourglassOutlined, LogoutOutlined, SettingOutlined, ShoppingOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import InputField from 'custom-fields/InputField';
import ButtonCustom from 'components/ButtonCustom';
import UploadField from 'custom-fields/UploadField';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'app/authSlice';
import { Link } from 'react-router-dom';

Profile.propTypes = {

};

function Profile(props) {

    const { user } = useSelector(state => state.auth);
    const [currentAvatar, setCurrentAvatar] = React.useState(() => user?.ANH_DAI_DIEN || 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png');
    const dispatch = useDispatch();

    const initialValues = {
        ...user
    }

    React.useEffect(() => {
        if (!user) return;
        form.setFieldsValue(user)
    }, [user])

    const [form] = Form.useForm();
    console.log({ initialValues })

    return (
        <div className='wrapper-content'>
            <div className="profile">
                <Tabs tabPosition='left' defaultActiveKey="1">
                    <Tabs.TabPane
                        tab={
                            <span>
                                <UserOutlined />
                                Thông tin tài khoản
                            </span>
                        }
                        key="1">

                        <Row justify='center'>
                            <Col xs={24} sm={24} md={24} lg={12}>
                                <Form
                                    onFinish={(values) => console.log({ values })}
                                    form={form}
                                    initialValues={initialValues}
                                    layout='vertical'>
                                    <div className='avatar-wrapper'>
                                        <div className='avatar'>
                                            <div className='show-avatar'>
                                                <img src={currentAvatar} alt='avatar'></img>
                                            </div>
                                            <UploadField name='ANH_DAI_DIEN' icon={<CameraOutlined className='icon-camera' />} getUrl={(url) => setCurrentAvatar(url)} />
                                        </div>
                                    </div>
                                    <InputField name='USER_ID' label='Mã người dùng' disabled />
                                    <InputField name='HO_TEN' label='Họ tên' />
                                    <InputField name='SO_DIEN_THOAI' label='Số điện thoại' />
                                    <InputField name='EMAIL' label='Email' />
                                    <InputField name='DIA_CHI' label='Địa chỉ' type='textarea' rows={5} />
                                    <ButtonCustom type='submit' text='Lưu'></ButtonCustom>
                                </Form>
                            </Col>
                        </Row>

                    </Tabs.TabPane>
                    {
                        user?.USER_ID && <Tabs.TabPane
                            tab={
                                <span>
                                    <HistoryOutlined />
                                    Lịch sử mua hàng (20)
                                </span>
                            }
                            key="2"
                        >

                            <Row justify='center'>
                                <Col xs={24} sm={20} md={20} lg={20}>
                                    <div className="current-orders">
                                        <Row justify='center'>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <div className='statistical'>
                                                    <HourglassOutlined />
                                                    <div className='statistical-text'>Chờ xử lý (5)</div>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <div className='statistical'>
                                                    <CarOutlined />
                                                    <div className='statistical-text'>Đang vận chuyển (4)</div>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <div className='statistical'>
                                                    <ShoppingOutlined />
                                                    <div className='statistical-text'>Đã giao (1)</div>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <div className='statistical'>
                                                    <WarningOutlined />
                                                    <div className='statistical-text'>Đã hủy (10)</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <ul className="history-bought">
                                        <Collapse>
                                            <Collapse.Panel header="Đơn hàng: HD019302329" key="1" extra={<span className='status-pending'>Chờ xử lý</span>}>
                                                <li className='history-bought__item'>
                                                    <div className='history-bought__item__body'>
                                                        <div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>Trương Việt Linh</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>01213032</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>không áp dụng</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>2022/8/11</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>ấp Hòa Phú xã Xuân Hòa huyện Kế Sách , tỉnh Sóc Trăng</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>28,852,000 ₫</strong>
                                                            </div>
                                                            <br />
                                                        </div>
                                                        <Collapse>
                                                            <Collapse.Panel header="Chi tiết sản phẩm" key="1">
                                                                <ul className='list-products'>
                                                                    <li>
                                                                        <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/13900AA05.BDC102-600x600-300x300.jpg' />
                                                                        <a className='name'>ĐỒNG HỒ LOUIS ERARD 13900AA05.BDC102 NAM PIN DÂY DA</a>
                                                                        <span>x 1</span>
                                                                        <strong>18,195,000&nbsp;₫</strong>
                                                                    </li>
                                                                </ul>
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    </div>
                                                    <div className='history-bought__item__footer'>
                                                        <ButtonCustom className="btn-info-custom" text='Đánh giá' />
                                                        <ButtonCustom className="btn-success-custom" text='Đã nhận được hàng ?' />
                                                    </div>
                                                </li>
                                            </Collapse.Panel>
                                            <Collapse.Panel header="Đơn hàng: HD019302330" key="2" extra={<span className='status-success'>Đã giao</span>}>
                                                <li className='history-bought__item'>
                                                    <div className='history-bought__item__body'>
                                                        <div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>Trương Việt Linh</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>01213032</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>không áp dụng</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>2022/8/11</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>ấp Hòa Phú xã Xuân Hòa huyện Kế Sách , tỉnh Sóc Trăng</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>28,852,000 ₫</strong>
                                                            </div>
                                                            <br />
                                                        </div>
                                                        <Collapse>
                                                            <Collapse.Panel header="Chi tiết sản phẩm" key="1">
                                                                <ul className='list-products'>
                                                                    <li>
                                                                        <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/13900AA05.BDC102-600x600-300x300.jpg' />
                                                                        <a className='name'>ĐỒNG HỒ LOUIS ERARD 13900AA05.BDC102 NAM PIN DÂY DA</a>
                                                                        <span>x 1</span>
                                                                        <strong>18,195,000&nbsp;₫</strong>
                                                                    </li>
                                                                </ul>
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    </div>
                                                    <div className='history-bought__item__footer'>
                                                        <ButtonCustom className="btn-info-custom" text='Đánh giá' />
                                                        <ButtonCustom className="btn-success-custom" text='Đã nhận được hàng ?' />
                                                    </div>
                                                </li>
                                            </Collapse.Panel>
                                        </Collapse>


                                    </ul>
                                    <br />
                                    <Pagination current={1} total={10} pageSize={1} />
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                    }
                    {
                        user?.NV_ID && <Tabs.TabPane
                            tab={
                                <Link style={{ color: '#555' }} to="/admin/dashboard">
                                    <SettingOutlined />
                                    Quản lý website
                                </Link>
                            }
                            key="3"
                        >
                        </Tabs.TabPane>
                    }
                    <Tabs.TabPane
                        tab={
                            <div onClick={() => dispatch(logout())}>
                                <LogoutOutlined />
                                Đăng xuất
                            </div>
                        }
                        key="4"
                    >
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Profile;