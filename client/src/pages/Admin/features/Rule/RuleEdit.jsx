
import { Button, Form } from 'antd';
import { danhmucApi } from 'api/uudaiApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import { quyenApi } from 'api/quyenApi';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_rules } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

RuleEdit.propTypes = {

};

let schema = yup.object().shape({
    MA_QUYEN: yup.string().required('Mã quyền không được để trống.'),
    TEN_QUYEN: yup.string().required('Tên quyền không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function RuleEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.rules);
    const { rules: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_ProductType, setOptions_ProductType] = React.useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        MA_QUYEN: currentSelected?.MA_QUYEN || '',
        TEN_QUYEN: currentSelected?.TEN_QUYEN || ''
    }

    const handleSave = async (values) => {
        try {
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await quyenApi.post(values) : await quyenApi.update(currentSelected.MA_QUYEN, values);
            await dispatch(fetch_rules({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/rules/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error);
        }
    }

    // React.useEffect(() => {
    //     const fetchAllProductType = async () => {
    //         try {
    //             const { result } = await loaisanphamApi.getAll();
    //             setOptions_ProductType(result.map((e) => ({ label: e.MA_LOAI_SP + ' - ' + e.TEN_LOAI_SP, value: e.MA_LOAI_SP })))
    //         } catch (error) {
    //             console.log({ error });
    //         }
    //     }

    //     fetchAllProductType();


    // }, [])

    return (
        <div className='rule-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='MA_QUYEN' label='Mã quyền' rules={[yupSync]} />
                <InputField name='TEN_QUYEN' label='Tên quyền' rules={[yupSync]} />
                {/* <SelectField name='MA_LOAI_SP' label='Loại sản phẩm' rules={[yupSync]} options={options_ProductType} /> */}
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default RuleEdit;