import { Button, Drawer, Form } from 'antd';
import { nguoidungApi } from 'api/nguoidungApi';
import { login } from 'app/authSlice';
import axios from 'axios';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { switch_screenLogin } from 'pages/User/userSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
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
    PROVINCES: yup.string().required('Tỉnh/Thành phố không được để trống.'),
    DISTRICT: yup.string().required('Quận/Huyện không được để trống.'),
    WARDS: yup.string().required('Phường/Xã không được để trống.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function Auth(props) {

    const [isLoginMode, setIsLoginMode] = React.useState(true)
    const { isVisibleScreenLogin } = useSelector(state => state.userInfo);
    const { isLoading, errorMsg } = useSelector(state => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [formLogin] = Form.useForm();
    const [formRegister] = Form.useForm();
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

    return (
        <div className='auth-wrapper'>
            {
                <Drawer
                    onClose={() => dispatch(switch_screenLogin(false))}
                    visible={isVisibleScreenLogin} title={isLoginMode ? 'Đăng nhập' : 'Đăng ký'} placement="right" >
                    {/* login */}
                    {
                        isLoginMode ?
                            <Form
                                form={formLogin}
                                layout='vertical'
                                onFinish={(values) => onLogin(values)}>
                                <InputField name='EMAIL' label='Email' rules={[yupSync]} />
                                <InputField name='MAT_KHAU' label='Mật khẩu' type='password' rules={[yupSync]} />
                                <a>Quên mật khẩu?</a>
                                <ButtonCustom
                                    isLoading={isLoading.login || isLoading.getMe}
                                    type='submit'
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                                    text="Đăng nhập" />
                                <Button block style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(false)}>Đăng ký tài khoản mới</Button>
                                <br />
                                <br />
                                <div className="group-login-social-media">
                                    <p>or</p>
                                    <LoginSocialFacebook
                                        isOnlyGetToken
                                        appId={process.env.REACT_APP_FB_APP_ID || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <FacebookLoginButton className='btn-social-media' />
                                    </LoginSocialFacebook>

                                    <LoginSocialGoogle
                                        isOnlyGetToken
                                        appId={process.env.REACT_APP_GG_APP_ID || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <GoogleLoginButton className='btn-social-media' />
                                    </LoginSocialGoogle>

                                    <LoginSocialGithub
                                        isOnlyGetToken
                                        client_id={process.env.REACT_APP_GITHUB_APP_ID || ''}
                                        client_secret={process.env.REACT_APP_GITHUB_APP_SECRET || ''}
                                        onLoginStart=""
                                        onResolve=""
                                        onReject=""
                                    >
                                        <GithubLoginButton className='btn-social-media' />
                                    </LoginSocialGithub>

                                </div>
                            </Form> :
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
                                <Button block style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(true)}>Đã có tài khoản?</Button>
                            </Form>
                    }
                </Drawer>
            }
        </div >
    );
}

export default Auth;