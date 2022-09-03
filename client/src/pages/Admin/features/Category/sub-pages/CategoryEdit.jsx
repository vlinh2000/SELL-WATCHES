
import { Button, Form } from 'antd';
import { danhmucApi } from 'api/danhmucApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_categories } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

CategoryEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_DANH_MUC: yup.string().required('Tên danh mục không được để trống.'),
    MA_LOAI_SP: yup.string().required('Loại sản phẩm không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function CategoryEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.categories);
    const { categories: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_ProductType, setOptions_ProductType] = React.useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_DANH_MUC: currentSelected?.TEN_DANH_MUC || '',
        MA_LOAI_SP: currentSelected?.MA_LOAI_SP || ''
    }

    const handleSave = async (values) => {
        try {
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await danhmucApi.post(values) : await danhmucApi.update(currentSelected.MA_DANH_MUC, values);
            await dispatch(fetch_categories({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/categories/view');
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
        const fetchAllProductType = async () => {
            try {
                const { result } = await loaisanphamApi.getAll();
                setOptions_ProductType(result.map((e) => ({ label: e.MA_LOAI_SP + ' - ' + e.TEN_LOAI_SP, value: e.MA_LOAI_SP })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllProductType();


    }, [])

    return (
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='TEN_DANH_MUC' label='Tên danh mục' rules={[yupSync]} />
                <SelectField name='MA_LOAI_SP' label='Loại sản phẩm' rules={[yupSync]} options={options_ProductType} />
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default CategoryEdit;