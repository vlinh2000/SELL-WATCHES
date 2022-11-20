import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Radio, Space } from 'antd';
import CheckField from 'custom-fields/CheckField';
import FormItem from 'antd/lib/form/FormItem';
import InputField from 'custom-fields/InputField';
import ButtonCustom from 'components/ButtonCustom';
import { donhangApi } from 'api/donhangApi';
import toast from 'react-hot-toast';
import moment from 'moment';
import PickDateField from 'custom-fields/PickDateField';

OrderEdit.propTypes = {

};



function OrderEdit(props) {
    const { switch_areaEdit, isShowAreaEdit, order, onRefresh } = props;
    const [form] = Form.useForm();
    const [currentOrderStatus, setCurrentOrderStatus] = React.useState();
    const [isLoading, setIsLoading] = React.useState();

    const handleSwitch = (isShow) => {
        if (!switch_areaEdit) return;
        switch_areaEdit(isShow);
    }

    const handleRefresh = (isShow) => {
        if (!onRefresh) return;
        onRefresh();
    }

    const options_orderStatus = React.useMemo(() => [
        { label: 'Chờ xử lý', value: 0, disabled: order?.TRANG_THAI >= 0 },
        { label: 'Đang vận chuyển', value: 1, disabled: order?.TRANG_THAI >= 1 },
        { label: 'Đã giao', value: 2, disabled: order?.TRANG_THAI >= 2 },
        { label: 'Đã hủy', value: 3, disabled: order?.TRANG_THAI >= 2 },
    ], [order])

    const initialValues = {
        TRANG_THAI: order?.TRANG_THAI
    }

    React.useEffect(() => {
        if (order?.TRANG_THAI !== null) {
            form.setFieldValue('TRANG_THAI', order?.TRANG_THAI)
            setCurrentOrderStatus(order?.TRANG_THAI);
        }
    }, [order])


    const handleUpdate = async (values) => {
        try {
            if (values.TRANG_THAI === 1 && moment().isAfter(values?.TG_GIAO_HANG)) return toast.error("Thời gian giao hàng không hợp lệ.")
            setIsLoading(true);
            const data = { action: values.TRANG_THAI === 1 ? 'confirm' : values.TRANG_THAI === 2 ? 'received' : 'cancle', ...values }
            console.log({ values });
            const { message } = await donhangApi.update(order.MA_DH, data);
            toast.success(message);
            setIsLoading(false);
            handleRefresh();
            handleSwitch(false);
        } catch (error) {
            setIsLoading(false);
            console.log({ error })
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='order-edit'>
            <Drawer
                title={`Đơn hàng: ${order?.MA_DH || '---'}`}
                placement='right'
                maskStyle={{ background: 'none' }}
                closable={true}
                onClose={() => handleSwitch(false)}
                visible={isShowAreaEdit}

                key='orderEdit' >
                <Form
                    form={form}
                    initialValues={initialValues}
                    layout='vertical'
                    onFinish={handleUpdate}>
                    <CheckField
                        onChange={status => setCurrentOrderStatus(status)}
                        direction='vertical'
                        type='radio-box'
                        name='TRANG_THAI'
                        label='Trạng thái đơn hàng'
                        options={options_orderStatus}
                    />
                    {
                        currentOrderStatus === 1 && order?.TRANG_THAI === 0 &&
                        <PickDateField placeHolder='-- Chọn thời gian giao hàng dự kiến --' name='TG_GIAO_HANG' rules={[{ required: true, message: 'Vui lòng chọn ngày.' }]} label='Thời gian giao hàng dự kiến' />
                    }
                    <br />
                    <ButtonCustom isLoading={isLoading} disabled={currentOrderStatus === order?.TRANG_THAI} style={{ cursor: currentOrderStatus === order?.TRANG_THAI ? 'not-allowed' : 'pointer' }} type='submit'>Cập nhật</ButtonCustom>

                </Form>
            </Drawer>
        </div >
    );
}

export default OrderEdit;