
import { Button, Form } from 'antd';
import { danhmucApi } from 'api/danhmucApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import { nhacungcapApi } from 'api/nhacungcapApi';
import axios from 'axios';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_suppliers } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

SupplierEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_NCC: yup.string().required('Tên nhà cung cấp không được để trống.'),
    SO_DIEN_THOAI: yup.string()
        .required("Số điện thoại không được để trống.")
        .matches(/^[0-9]+$/, "Vui lòng nhập số.")
        .min(10, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)')
        .max(11, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)'),
    PROVINCES: yup.string().required('Tỉnh/Thành phố không được để trống.'),
    DISTRICT: yup.string().required('Quận/Huyện không được để trống.'),
    WARDS: yup.string().required('Phường/Xã không được để trống.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function SupplierEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.suppliers);
    const { suppliers: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_ProductType, setOptions_ProductType] = React.useState([{ value: 1, label: 'text', code: 100 }]);
    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);

    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_NCC: currentSelected?.TEN_NCC || '',
        SO_DIEN_THOAI: currentSelected?.SO_DIEN_THOAI || '',
        PROVINCES: currentSelected?.PROVINCES || '',
        DISTRICT: currentSelected?.DISTRICT || '',
        WARDS: currentSelected?.WARDS || '',
    }

    const handleSave = async (values) => {
        try {
            console.log({ values })
            const address = [values.WARDS, values.DISTRICT, values.PROVINCES].join(", ");
            const data = {
                TEN_NCC: values.TEN_NCC,
                SO_DIEN_THOAI: values.SO_DIEN_THOAI,
                DIA_CHI: address
            }
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await nhacungcapApi.post(data) : await nhacungcapApi.update(currentSelected.MA_NCC, data);
            await dispatch(fetch_suppliers({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/suppliers/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error);
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
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='TEN_NCC' label='Tên nhà cung cấp' rules={[yupSync]} />
                <InputField name='SO_DIEN_THOAI' label='Số điện thoại' rules={[yupSync]} />

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
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default SupplierEdit;