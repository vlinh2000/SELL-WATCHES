
import { Button, Col, Form, Row } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_productTypes } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

ProductTypeEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_LOAI_SP: yup.string().required('Tên loại sản phẩm không được để trống.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function ProductTypeEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.productTypes);
    const { productTypes: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_LOAI_SP: currentSelected?.TEN_LOAI_SP || '',
    }

    const handleSave = async (values) => {
        try {
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await loaisanphamApi.post(values) : await loaisanphamApi.update(currentSelected.MA_LOAI_SP, values);
            await dispatch(fetch_productTypes({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/productTypes/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='TEN_LOAI_SP' label='Tên loại sản phẩm' placeHolder='-- Nhập tên loại sản phẩm --' rules={[yupSync]} />
                <br />
                <ButtonCustom
                    type='submit'
                    isLoading={isLoading}>Lưu</ButtonCustom>
            </Form>
        </div>
    );
}

export default ProductTypeEdit;