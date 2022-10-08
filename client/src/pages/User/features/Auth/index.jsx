import { Alert, Button, Divider, Drawer, Form, Tag } from 'antd';
import { authApi } from 'api/authApi';
import { nguoidungApi } from 'api/nguoidungApi';
import { getMe, login, login_socialMedia, saveAuthInfo } from 'app/authSlice';
import axios from 'axios';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { switch_screenLogin } from 'pages/User/userSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FacebookLoginButton, GithubLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialFacebook, LoginSocialGithub, LoginSocialGoogle } from 'reactjs-social-login';
import * as yup from 'yup';
import './Auth.scss';


Auth.propTypes = {

};

let schema = yup.object().shape({
    HO_TEN: yup.string().required('Họ tên không được để trống.'),
    SO_DIEN_THOAI: yup.string()
        .required("Số điện thoại không được để trống.")
        .matches(/^[0-9]+$/, "Vui lòng nhập số.")
        .min(10, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)')
        .max(11, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)'),
    EMAIL: yup
        .string().required('Email không được để trống.').email("Email không hợp lệ."),
    GIOI_TINH: yup.string().required('Giới tính không được để trống.'),
    MAT_KHAU: yup.string().required('Mật khẩu không được để trống.'),
    MAT_KHAU_XAC_NHAN: yup.string().required('Mật khẩu xác nhận được để trống.'),
    PROVINCES: yup.string().required('Tỉnh/Thành phố không được để trống.'),
    DISTRICT: yup.string().required('Quận/Huyện không được để trống.'),
    WARDS: yup.string().required('Phường/Xã không được để trống.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

const REDIRECT_URI = window.location.href;

function Auth(props) {

    const [screenMode, setScreenMode] = React.useState('login')
    const { isVisibleScreenLogin } = useSelector(state => state.userInfo);
    const { isLoading, errorMsg } = useSelector(state => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [formLogin] = Form.useForm();
    const [formRegister] = Form.useForm();
    const [formForgetPassword] = Form.useForm();
    const [formResetPassword] = Form.useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const [resetPassInfo, setResetPassInfo] = React.useState();



    const [stepToResetPass, setStepToResetPass] = React.useState(0);
    const dispatch = useDispatch()

    const onLogin = async (values) => {
        const { error, payload } = await dispatch(login(values));
        if (error) {
            const { message } = payload.response.data;
            toast.error(message);
            return;
        }
    }

    const initialValues = {
        HO_TEN: '',
        SO_DIEN_THOAI: '',
        EMAIL: '',
        GIOI_TINH: '',
        MAT_KHAU: '',
        PROVINCES: '',
        DISTRICT: '',
        WARDS: ''
    }

    const onRegister = async (values) => {
        try {
            const address = [values.WARDS, values.DISTRICT, values.PROVINCES].join(", ");
            const data = {
                HO_TEN: values.HO_TEN,
                SO_DIEN_THOAI: values.SO_DIEN_THOAI,
                EMAIL: values.EMAIL,
                GIOI_TINH: values.GIOI_TINH,
                MAT_KHAU: values.MAT_KHAU,
                DIA_CHI: address
            }
            setLoading(true);
            const { message } = await nguoidungApi.register(data);
            setLoading(false);
            toast.success(message);
            await onLogin({ EMAIL: values.EMAIL, MAT_KHAU: values.MAT_KHAU })
        } catch (error) {
            setLoading(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    React.useEffect(() => {
        const fetchAllProvinces = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_PROVINCES);
                setOptions_Provinces(data.map((e) => ({ label: e.name, value: e.name, code: e.code })))
            } catch (error) {
                console.log({ error });
            }
        }
        fetchAllProvinces();
    }, [])

    React.useEffect(() => {
        const fetchAllDistrictInProvinces = async () => {
            try {
                if (addressCode.provincesCode == null) {
                    setOptions_district([]);
                    return;
                }
                const { data: { districts } } = await axios.get(`${process.env.REACT_APP_API_PROVINCES}p/${addressCode.provincesCode}?depth=2`);
                setOptions_district(districts.map((e) => ({ label: e.name, value: e.name, code: e.code })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllDistrictInProvinces();

    }, [addressCode.provincesCode])

    React.useEffect(() => {
        const fetchAllWardsInDistrict = async () => {
            try {
                if (addressCode.districtCode == null) {
                    setOptions_wards([]);
                    return;
                }
                const { data: { wards } } = await axios.get(`${process.env.REACT_APP_API_PROVINCES}d/${addressCode.districtCode}?depth=2`);
                setOptions_wards(wards.map((e) => ({ label: e.name, value: e.name, code: e.code })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllWardsInDistrict();

    }, [addressCode.districtCode])


    const onLoginSuccess = async ({ provider, data }) => {
        const token = data.access_token || data.accessToken;
        const accountType = provider + "_mxh";
        const HO_TEN = (data.family_name && data.given_name) ? data.family_name + ' ' + data.given_name : '';
        const user = {
            USER_ID: data.id,
            HO_TEN: data.name || HO_TEN,
            SO_DIEN_THOAI: data.phone || '',
            EMAIL: data.email,
            ANH_DAI_DIEN: data.picture?.data?.url || data.picture,
            LOAI_TAI_KHOAN: accountType
        }
        const { error, payload } = await dispatch(login_socialMedia(user));
        if (error) {
            const { message } = payload.response.data;
            toast.error(message);
            return;
        }

        dispatch(switch_screenLogin(false));

    }

    const onLoginError = (error) => {
        toast.error("Có lỗi xảy ra vui lòng thử lại sau ít phút.")
    }

    const handleForgetPassword = async (values, isSendMail) => {
        try {
            setLoading(true);
            const data = isSendMail ? { SEND_MAIL_FLAG: isSendMail, EMAIL: values.EMAIL } : { SEND_MAIL_FLAG: isSendMail, TOKEN: resetPassInfo.TOKEN, MAT_KHAU: values.MAT_KHAU };
            const { message, result } = await nguoidungApi.forgetPassword(data);
            toast.success(message);
            if (isSendMail) {
                setStepToResetPass(1)
            } else {
                formLogin.resetFields();
                await dispatch(login({ EMAIL: result.EMAIL, MAT_KHAU: values.MAT_KHAU }));
                setScreenMode('login');
                setStepToResetPass(0);
                setResetPassInfo(null)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    React.useEffect(() => {
        // console.log(searchParams.get('token'))
        const action = searchParams.get('action');
        const token = searchParams.get('token');
        // WHEN RESET PASSWORD
        if (action === 'resetpass') {
            dispatch(switch_screenLogin(true));
            setScreenMode('forgetPassword');
            setStepToResetPass(2);
            setResetPassInfo({ TOKEN: token })
        }

    }, [searchParams])

    return (
        <div className='auth-wrapper'>
            {
                <Drawer
                    onClose={() => dispatch(switch_screenLogin(false))}
                    visible={isVisibleScreenLogin}
                    title={screenMode === 'login' ? 'Đăng nhập' : screenMode === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}
                    placement="right" >
                    {/* login */}
                    {
                        screenMode === 'login' ?
                            <Form
                                form={formLogin}
                                layout='vertical'
                                onFinish={(values) => onLogin(values)}>
                                <InputField name='EMAIL' label='Email' rules={[yupSync]} />
                                <InputField name='MAT_KHAU' label='Mật khẩu' type='password' rules={[yupSync]} />
                                <a onClick={() => setScreenMode('forgetPassword')}>Quên mật khẩu?</a>
                                <ButtonCustom
                                    isLoading={isLoading.login || isLoading.getMe}
                                    type='submit'
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                                    text="Đăng nhập" />
                                <Button block style={{ marginTop: '1rem' }} onClick={() => setScreenMode('register')}>Đăng ký tài khoản mới</Button>
                                <br />
                                <br />
                                <div className="group-login-social-media">
                                    <p>or</p>
                                    <LoginSocialFacebook
                                        appId={process.env.REACT_APP_FB_CLIENT_ID || ''}
                                        onResolve={onLoginSuccess}
                                        onReject={onLoginError}>
                                        <FacebookLoginButton className='btn-social-media' />
                                    </LoginSocialFacebook>

                                    <LoginSocialGoogle
                                        client_id={process.env.REACT_APP_GG_CLIENT_ID || ''}
                                        scope='https://www.googleapis.com/auth/userinfo.email'
                                        onResolve={onLoginSuccess}
                                        onReject={onLoginError}>
                                        <GoogleLoginButton className='btn-social-media' />
                                    </LoginSocialGoogle>
                                </div>
                            </Form> :
                            screenMode === 'register' ?
                                <Form
                                    initialValues={initialValues}
                                    form={formRegister}
                                    layout='vertical'
                                    onFinish={(values) => onRegister(values)}>
                                    <InputField name='HO_TEN' label='Họ tên' rules={[yupSync]} />
                                    <InputField name='EMAIL' label='Email' rules={[yupSync]} />
                                    <InputField name='MAT_KHAU' label='Mật khẩu' type='password' rules={[yupSync]} />
                                    <InputField name='SO_DIEN_THOAI' label='Số điện thoại' rules={[yupSync]} />

                                    <SelectField name='GIOI_TINH' label='Giới tính' rules={[yupSync]}
                                        options={[{ value: 'Nam', label: 'Nam' }, { value: 'Nữ', label: 'Nữ' }, { value: 'Khác', label: 'Khác' }]} />

                                    <SelectField onChange={(_, options) => {
                                        setAddressCode(prev => ({ ...prev, provincesCode: options.code, districtCode: null }))
                                        formRegister.setFieldValue('DISTRICT', '');
                                        formRegister.setFieldValue('WARDS', '');
                                    }} name='PROVINCES' label='Tỉnh/Thành phố' rules={[yupSync]} options={options_Provinces} />

                                    <SelectField onChange={(_, options) => {
                                        setAddressCode(prev => ({ ...prev, districtCode: options.code, wardsCode: null }))
                                        formRegister.setFieldValue('WARDS', '');
                                    }} name='DISTRICT' label='Quận/Huyện' rules={[yupSync]} options={options_district} />

                                    <SelectField name='WARDS' label='Phường/Xã' rules={[yupSync]} options={options_wards} />
                                    <br />
                                    <ButtonCustom isLoading={loading} htmlType='submit' style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} text="Đăng ký" />
                                    <Button block style={{ marginTop: '1rem' }} onClick={() => setScreenMode('login')}>Đã có tài khoản?</Button>
                                </Form>
                                :
                                <>
                                    {
                                        stepToResetPass === 0 ?
                                            <Form
                                                initialValues={{ EMAIL: '' }}
                                                form={formForgetPassword}
                                                layout='vertical'
                                                onFinish={(values) => handleForgetPassword(values, true)}>
                                                <InputField name='EMAIL' label='Email khôi phục' rules={[yupSync]} />
                                                <br />
                                                <ButtonCustom isLoading={loading} htmlType='submit' style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} text="Lấy lại mật mẩu" />
                                            </Form>
                                            :
                                            stepToResetPass === 1 ?
                                                <Alert
                                                    description={<span>Chúng tôi đã gửi đường dẫn để tạo lại mật khẩu mới vào email <strong>{formLogin.getFieldValue('EMAIL')}</strong>. Hãy kiểm tra email của bạn và tạo mới mật khẩu an toàn hơn nhé.</span>}
                                                    showIcon type='success'
                                                    message="Thông báo !"></Alert>
                                                :
                                                <Form
                                                    form={formResetPassword}
                                                    layout='vertical'
                                                    onFinish={(values) => handleForgetPassword(values, false)}>
                                                    <InputField name='MAT_KHAU' label='Mật khẩu mới'
                                                        type='password'
                                                        rules={[yupSync]} />
                                                    <InputField
                                                        dependencies={['MAT_KHAU']}
                                                        name='MAT_KHAU_XAC_NHAN' label='Xác nhận mật khẩu'
                                                        type='password'
                                                        rules={[
                                                            yupSync,
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    if (!value || getFieldValue('MAT_KHAU') === value) {
                                                                        return Promise.resolve();
                                                                    }

                                                                    return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp.'));
                                                                },
                                                            }),
                                                        ]} />
                                                    <br />
                                                    <ButtonCustom isLoading={loading} htmlType='submit' style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} text="Lấy lại mật mẩu" />
                                                </Form>
                                    }
                                    <br />
                                    <Button onClick={() => {
                                        setScreenMode('login');
                                        setStepToResetPass(0);
                                        formLogin.resetFields();
                                    }}>Quay lại</Button>
                                </>
                    }
                </Drawer>
            }
        </div >
    );
}

export default Auth;