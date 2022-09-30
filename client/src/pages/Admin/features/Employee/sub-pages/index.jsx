import { CameraOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Row, Space } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { nhacungcapApi } from 'api/nhacungcapApi';
import { nhanvienApi } from 'api/nhanvienApi';
import { quyenApi } from 'api/quyenApi';
import axios from 'axios';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import UploadField from 'custom-fields/UploadField';
import { fetch_employees } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import './EmployeeEdit.scss';

EmployeeEdit.propTypes = {

};

let schema = yup.object().shape({
    MA_CV: yup.string().required('Chức vụ không được để trống.'),
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
    QUYEN: yup.array().min(1, "Quyền không được để trống.")
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function EmployeeEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.employees);
    const { employees: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_Position, setOptions_Position] = React.useState([]);
    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [options_rules, setOptions_rules] = React.useState([]);
    const [currentAvatar, setCurrentAvatar] = React.useState(currentSelected?.ANH_DAI_DIEN || 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png');


    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        MA_CV: currentSelected?.MA_CV || '',
        HO_TEN: currentSelected?.HO_TEN || '',
        SO_DIEN_THOAI: currentSelected?.SO_DIEN_THOAI || '',
        EMAIL: currentSelected?.EMAIL || '',
        GIOI_TINH: currentSelected?.GIOI_TINH || '',
        MAT_KHAU: currentSelected?.MAT_KHAU || '',
        PROVINCES: currentSelected?.PROVINCES || '',
        DISTRICT: currentSelected?.DISTRICT || '',
        WARDS: currentSelected?.WARDS || '',
        ANH_DAI_DIEN: currentSelected?.ANH_DAI_DIEN || '',
        // QUYEN: currentSelected?.QUYEN || [],
    }

    const handleSave = async (values) => {
        try {
            const address = [values.WARDS, values.DISTRICT, values.PROVINCES].join(", ");
            const data = new FormData();
            data.append('MA_CV', values.MA_CV);
            data.append('ANH_DAI_DIEN', values.ANH_DAI_DIEN.file || values.ANH_DAI_DIEN);
            data.append('HO_TEN', values.HO_TEN);
            data.append('SO_DIEN_THOAI', values.SO_DIEN_THOAI);
            data.append('EMAIL', values.EMAIL);
            data.append('GIOI_TINH', values.GIOI_TINH);
            data.append('MAT_KHAU', values.MAT_KHAU);
            data.append('DIA_CHI', address);
            data.append('QUYEN', JSON.stringify(values.QUYEN));

            setIsLoading(true);
            const { message } = mode === 'ADD' ? await nhanvienApi.post(data) : await nhanvienApi.update(currentSelected.NV_ID, data);
            await dispatch(fetch_employees({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/employees/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
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

        const fetchPositions = async () => {
            try {
                const { result } = await chucvuApi.getAll();
                setOptions_Position(result.map((e) => ({ label: e.TEN_CV, value: e.MA_CV })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchPositions();
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

    React.useEffect(() => {
        const fetchAllRules = async () => {
            try {
                const { result } = await quyenApi.getAll();
                setOptions_rules(result.map((e) => ({ label: `[${e.MA_QUYEN}] ${e.TEN_QUYEN}`, value: e.MA_QUYEN })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllRules();
    }, [])

    React.useEffect(() => {
        const fetchUserRules = async () => {
            try {
                const { result } = await quyenApi.getAll({ action: 'get_user_rules', NV_ID: currentSelected?.NV_ID });
                form.setFieldValue('QUYEN', result?.map(q => q.MA_QUYEN));
            } catch (error) {
                console.log({ error });
            }
        }

        currentSelected?.NV_ID && fetchUserRules();
    }, [currentSelected?.NV_ID])

    return (
        <div className='employee-edit box'>

            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <div className='avatar-wrapper'>
                            <div className='avatar'>
                                <div className='show-avatar'>
                                    <img src={currentAvatar} alt='avatar'></img>
                                </div>
                                <UploadField name='ANH_DAI_DIEN' icon={<CameraOutlined className='icon-camera' />} getUrl={(url) => setCurrentAvatar(url)} />
                            </div>
                        </div>
                        <InputField name='HO_TEN' label='Họ tên' rules={[yupSync]} />
                        <InputField name='SO_DIEN_THOAI' label='Số điện thoại' rules={[yupSync]} />
                        <InputField name='EMAIL' label='Email' disabled={currentSelected?.NV_ID} rules={[yupSync]} />
                        <SelectField name='GIOI_TINH' label='Giới tính' rules={[yupSync]}
                            options={[{ value: 'Nam', labe: 'Nam' }, { value: 'Nữ', labe: 'Nữ' }, { value: 'Khác', labe: 'Khác' }]} />
                        <InputField name='MAT_KHAU' label='Mật khẩu' rules={[yupSync]} />
                        <SelectField name='MA_CV' label='Chức vụ' options={options_Position} rules={[yupSync]} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>

                        <SelectField onChange={(_, options) => {
                            setAddressCode(prev => ({ ...prev, provincesCode: options.code, districtCode: null }))
                            form.setFieldValue('DISTRICT', '');
                            form.setFieldValue('WARDS', '');
                        }} name='PROVINCES' label='Tỉnh/Thành phố' rules={[yupSync]} options={options_Provinces} />

                        <SelectField onChange={(_, options) => {
                            setAddressCode(prev => ({ ...prev, districtCode: options.code, wardsCode: null }))
                            form.setFieldValue('WARDS', '');
                        }} name='DISTRICT' label='Quận/Huyện' rules={[yupSync]} options={options_district} />

                        <SelectField name='WARDS' label='Phường/Xã' rules={[yupSync]} options={options_wards} />
                        <Form.Item name="QUYEN" label="Quyền" >
                            <Checkbox.Group>
                                <Space direction='vertical'>
                                    {
                                        options_rules?.map((rule) => <Checkbox key={rule.value} value={rule.value}>{rule.label}</Checkbox>)
                                    }
                                </Space>
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default EmployeeEdit;


