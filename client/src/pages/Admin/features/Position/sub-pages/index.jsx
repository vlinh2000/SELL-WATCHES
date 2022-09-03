
import { Button, Col, Form, Row } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_positions, reload } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

PositionEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_CV: yup.string().required('Tên chức vụ không được để trống.'),
    LUONG_CO_BAN: yup
        .number()
        .required('Lương cơ bản không được để trống.')
        .typeError('Vui lòng nhập số.')
        .positive()
        .integer()
        .round(),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function PositionEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.positions);
    const { positions: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_CV: currentSelected?.TEN_CV || '',
        LUONG_CO_BAN: currentSelected?.LUONG_CO_BAN || ''
    }

    const handleSave = async (values) => {
        try {
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await chucvuApi.post(values) : await chucvuApi.update(currentSelected.MA_CV, values);
            await dispatch(fetch_positions({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/positions/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error);
        }
    }

    return (
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <InputField name='TEN_CV' label='Tên chức vụ' rules={[yupSync]} />
                <InputField name='LUONG_CO_BAN' label='Lương cơ bản' rules={[yupSync]} />
                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div>
    );
}

export default PositionEdit;