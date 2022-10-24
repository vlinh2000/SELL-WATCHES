import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Collapse, Divider, Empty, Form, Pagination, Row, Tabs, Tooltip } from 'antd';
import { AndroidOutlined, AppleOutlined, CameraOutlined, CarOutlined, HistoryOutlined, HourglassOutlined, LogoutOutlined, SettingOutlined, ShoppingOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import InputField from 'custom-fields/InputField';
import ButtonCustom from 'components/ButtonCustom';
import UploadField from 'custom-fields/UploadField';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, getNewToken, logout } from 'app/authSlice';
import { Link, useLocation } from 'react-router-dom';
import { defaultAvatar, isAccountOfThisSite } from 'constants/commonContants';
import { nguoidungApi } from 'api/nguoidungApi';
import { nhanvienApi } from 'api/nhanvienApi';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { getStatusOrder, numberWithCommas } from 'assets/admin';
import moment from 'moment';
import HistoryOrder from 'pages/User/components/HistoryOrder';
import { resetCart } from 'pages/User/userSlice';
import Title from 'components/Title';

Profile.propTypes = {

};

let schema = yup.object().shape({
    HO_TEN: yup.string().required('Họ tên không được để trống.'),
    SO_DIEN_THOAI: yup.string()
        .required("Số điện thoại không được để trống.")
        .matches(/^[0-9]+$/, "Vui lòng nhập số.")
        .min(10, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)')
        .max(11, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)'),
    DIA_CHI: yup.string().required('Địa chỉ không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};


function Profile(props) {

    const { user } = useSelector(state => state.auth);
    const { data: { myOrders }, pagination: { myOrders: pagination } } = useSelector(state => state.userInfo);
    const [currentAvatar, setCurrentAvatar] = React.useState(() => user?.ANH_DAI_DIEN || defaultAvatar);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const { state } = useLocation();
    const defaultActiveKey = useMemo(() => {
        state?.historyOrder && dispatch(resetCart());
        return state?.historyOrder ? '2' : '1'
    }, [state])

    const initialValues = {
        ...user, USER_ID: user?.USER_ID || user?.NV_ID
    }

    React.useEffect(() => {
        if (!user) return;
        form.setFieldsValue(user)
    }, [user])

    const [form] = Form.useForm();

    const handleUpdateInfo = async (values) => {

        try {
            setLoading(true);
            const data = new FormData();
            data.append('HO_TEN', values.HO_TEN);
            data.append('SO_DIEN_THOAI', values.SO_DIEN_THOAI);
            data.append('DIA_CHI', values.DIA_CHI);
            data.append('ANH_DAI_DIEN', values.ANH_DAI_DIEN.file || values.ANH_DAI_DIEN);
            const { message } = user.USER_ID ? await nguoidungApi.update(values.USER_ID, data) : await nhanvienApi.update(values.USER_ID, data);
            setLoading(false);
            toast.success(message);
            dispatch(getMe());
        } catch (error) {
            setLoading(false);
            console.log({ error })
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='wrapper-content'>
            {/* <Title style={{ fontSize: 20 }}>Thông tin cá nhân</Title> */}

            <div className="profile">
                <Tabs tabPosition='left' defaultActiveKey={defaultActiveKey}>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <UserOutlined />
                                Thông tin tài khoản
                            </span>
                        }
                        key="1">

                        <Row justify='center'>
                            <Col xs={24} sm={24} md={24} lg={14}>
                                <Form
                                    onFinish={handleUpdateInfo}
                                    form={form}
                                    disabled={user?.USER_ID && user?.LOAI_TAI_KHOAN !== isAccountOfThisSite}
                                    initialValues={initialValues}
                                    layout='vertical'>
                                    <div className='avatar-wrapper'>
                                        <div className='avatar'>
                                            <div className='show-avatar'>
                                                <img src={currentAvatar} alt='avatar'></img>
                                            </div>
                                            <UploadField
                                                name='ANH_DAI_DIEN'
                                                icon={<CameraOutlined className='icon-camera' />}
                                                getUrl={(url) => setCurrentAvatar(url)} />
                                        </div>
                                    </div>
                                    {
                                        (user.USER_ID && user.LOAI_TAI_KHOAN !== isAccountOfThisSite) && <>
                                            <Alert
                                                banner
                                                message={<div>Đây là tài khoản <strong>{user?.LOAI_TAI_KHOAN?.split('_')[0]?.toUpperCase()}</strong> do đó không thể cập nhật thông tin tại đây.</div>}
                                            />
                                            <Divider />
                                        </>
                                    }
                                    <InputField name='USER_ID' label='Mã người dùng' disabled />
                                    <InputField name='EMAIL' disabled label='Email' />
                                    <InputField name='HO_TEN' label='Họ tên' rules={[yupSync]} />
                                    <InputField name='SO_DIEN_THOAI' label='Số điện thoại' rules={[yupSync]} />
                                    <InputField name='DIA_CHI' label='Địa chỉ' type='textarea'
                                        rules={[yupSync]}
                                        rows={5} disabled={user?.USER_ID && user?.LOAI_TAI_KHOAN !== isAccountOfThisSite} />

                                    <br />
                                    {
                                        (user.NV_ID || user?.LOAI_TAI_KHOAN === isAccountOfThisSite) &&
                                        <ButtonCustom isLoading={loading} type='submit'>Lưu thay đổi</ButtonCustom>
                                    }
                                </Form>
                            </Col>
                        </Row>

                    </Tabs.TabPane>
                    {
                        user?.USER_ID &&
                        <Tabs.TabPane
                            tab={
                                <span>
                                    <HistoryOutlined />
                                    Lịch sử mua hàng ({pagination?._totalRecord})
                                </span>
                            }
                            key="2"
                        >
                            {
                                pagination?._totalRecord > 0 ? <HistoryOrder myOrders={myOrders} /> : <Empty />
                            }
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