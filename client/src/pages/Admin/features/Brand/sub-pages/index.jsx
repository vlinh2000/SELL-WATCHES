
import { Button, Form } from 'antd';
import { thuonghieuApi } from 'api/thuonghieuApi';
import axios from 'axios';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_brands } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

BrandEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_THUONG_HIEU: yup.string().required('Tên thương hiệu không được để trống.'),
    QUOC_GIA: yup.string().required('Quốc gia không được để trống.'),
    NAM_THANH_LAP: yup
        .number()
        .required('Năm thành lập không được để trống.')
        .typeError('Vui lòng nhập số.')
        .positive()
        .integer()
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function BrandEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.brands);
    const { brands: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_country, setOptions_country] = React.useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_THUONG_HIEU: currentSelected?.TEN_THUONG_HIEU || '',
        QUOC_GIA: currentSelected?.QUOC_GIA || '',
        NAM_THANH_LAP: currentSelected?.NAM_THANH_LAP || '',
    }

    const handleSave = async (values) => {
        try {
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await thuonghieuApi.post(values) : await thuonghieuApi.update(currentSelected.MA_THUONG_HIEU, values);
            await dispatch(fetch_brands({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/brands/view');
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
        const fetchCountries = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_COUNTRY_API_URL);
                setOptions_country(data.map((e) => ({ label: e.name + ' - ' + e.region, value: e.name })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchCountries();

    }, [])


    return (
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='TEN_THUONG_HIEU' label='Tên thương hiệu' rules={[yupSync]} />
                <SelectField name='QUOC_GIA' label='Quốc gia' options={options_country} rules={[yupSync]} />
                <InputField name='NAM_THANH_LAP' label='Năm thành lập' rules={[yupSync]} />
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default BrandEdit;