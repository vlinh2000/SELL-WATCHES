
import { PercentageOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Space } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { uudaiApi } from 'api/uudaiApi';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import moment from 'moment';
import { fetch_vouchers, reload } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import './VoucherEdit.scss'

VoucherEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_UU_DAI: yup.string().required('Tên ưu đãi không được để trống.'),
    SO_LUONG_BAN_DAU: yup.number().positive().typeError('Số lượng không được để trống.'),
    SO_LUONG_CON_LAI: yup.number().positive().typeError('Số lượng còn lại không được để trống.'),
    HSD: yup.date().required('Hạn sử dụng không được để trống.').typeError('Hạn sử dụng không được để trống.'),
    MPVC: yup.string().required('Loại ưu đãi không được để trống.'),
    GIA_TRI: yup.string().required('Giá trị không được để trống.'),

});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function VoucherEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.vouchers);
    const { vouchers: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isVisibleValueInput, setisVisibleValueInput] = React.useState(false);
    const [isVisibleVNDChoosen, setIsVisibleVNDChoosen] = React.useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        TEN_UU_DAI: currentSelected?.TEN_UU_DAI || '',
        SO_LUONG_BAN_DAU: currentSelected?.SO_LUONG_BAN_DAU || '',
        SO_LUONG_CON_LAI: currentSelected?.SO_LUONG_CON_LAI || '',
        HSD: new moment(currentSelected?.HSD) || new moment(),
        MPVC: currentSelected?.MPVC,
        GIA_TRI: currentSelected?.GIA_TRI || '',
        DON_VI_GIAM: currentSelected?.DON_VI_GIAM || '%',
        GIA_TRI_SO: currentSelected?.GIA_TRI || '',
    }

    React.useEffect(() => {
        if (!currentSelected) return;
        setisVisibleValueInput(!currentSelected?.MPVC);
        setIsVisibleVNDChoosen(currentSelected?.DON_VI_GIAM === '₫');
    }, [currentSelected])

    const handleSave = async (values) => {
        const isValidHSD = moment(values.HSD).isAfter(moment());
        if (!isValidHSD) return toast.error("HSD phải lớn hơn bây giờ.");
        try {
            setIsLoading(true);
            const data = {
                TEN_UU_DAI: values.TEN_UU_DAI,
                SO_LUONG_BAN_DAU: values.SO_LUONG_BAN_DAU,
                SO_LUONG_CON_LAI: values.SO_LUONG_CON_LAI,
                HSD: values.HSD.utc(true),
                MPVC: values.MPVC,
                GIA_TRI: values.GIA_TRI === -1 ? values.GIA_TRI_SO : values.GIA_TRI,
                DON_VI_GIAM: values.DON_VI_GIAM
            }

            const { message } = mode === 'ADD' ? await uudaiApi.post(data) : await uudaiApi.update(currentSelected.MA_UU_DAI, data);
            await dispatch(fetch_vouchers({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                setisVisibleValueInput(false);
                form.resetFields()
            } else {
                navigate('/admin/vouchers/view');
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
        <div className='voucher-edit box'>
            <Form
                onValuesChange={values => {
                    if (values.SO_LUONG_BAN_DAU) form.setFieldValue('SO_LUONG_CON_LAI', values.SO_LUONG_BAN_DAU);
                    else if (values.GIA_TRI) form.setFieldValue('GIA_TRI_SO', values.GIA_TRI === -1 ? '' : values.GIA_TRI)
                }}
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <Row gutter={[40, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <InputField name='TEN_UU_DAI' label='Tên ưu đãi' rules={[yupSync]} />
                        <InputField min={1} type='number' name='SO_LUONG_BAN_DAU' label='Số lượng' rules={[yupSync]} />
                        <InputField min={1} shouldUpdate type='number' disabled name='SO_LUONG_CON_LAI' label='Số lượng còn lại' rules={[yupSync]} />
                        <Form.Item
                            name='HSD' label='Hạn sử dụng' rules={[yupSync]}>
                            <DatePicker style={{ width: '100%' }} showTime />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>

                        <Form.Item
                            name='MPVC' label='Loại ưu đãi' rules={[yupSync]}>
                            <Radio.Group onChange={({ target }) => target.value === 0 ? setisVisibleValueInput(true) : setisVisibleValueInput(false)}>
                                <Space direction="vertical">
                                    <Radio value={1}>Miễn phí vận chuyển</Radio>
                                    <Radio value={0}>Giảm giá đơn hàng</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>

                        {
                            isVisibleValueInput &&
                            <>
                                <SelectField
                                    onChange={value => {
                                        value === '₫' ? setIsVisibleVNDChoosen(true) : setIsVisibleVNDChoosen(false);
                                        form.setFieldValue('GIA_TRI_SO', '');
                                        form.setFieldValue('GIA_TRI', -1);
                                    }}
                                    name='DON_VI_GIAM' label='Đơn vị giảm'
                                    options={[{ label: '₫', value: '₫' }, { label: '%', value: '%' }]}>
                                </SelectField>

                                {
                                    isVisibleVNDChoosen ?
                                        <>
                                            <Form.Item name='GIA_TRI' label='Giá trị' >
                                                <Radio.Group className='radio-button-custom'>
                                                    <Radio.Button value={10000}>10.000 đ</Radio.Button>
                                                    <Radio.Button value={20000}>20.000 đ</Radio.Button>
                                                    <Radio.Button value={30000}>30.000 đ</Radio.Button>
                                                    <Radio.Button value={40000}>40.000 đ</Radio.Button>
                                                    <Radio.Button value={50000}>50.000 đ</Radio.Button>
                                                    <Radio.Button value={75000}>75.000 đ</Radio.Button>
                                                    <Radio.Button value={100000}>100.000 đ</Radio.Button>
                                                    <Radio.Button value={-1}>Khác</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='GIA_TRI_SO' rules={[{ required: true, message: "Vui lòng chọn giá trị giảm giá." }]}>
                                                <Input shouldUpdate prefix="₫ " type="number" style={{ margin: '20px 0' }} placeholder='Khác'></Input>
                                            </Form.Item>
                                        </>
                                        :
                                        <>
                                            <Form.Item name='GIA_TRI' label='Giá trị' >
                                                <Radio.Group className='radio-button-custom'>
                                                    <Radio.Button value={5}>5%</Radio.Button>
                                                    <Radio.Button value={10}>10%</Radio.Button>
                                                    <Radio.Button value={20}>20%</Radio.Button>
                                                    <Radio.Button value={25}>25%</Radio.Button>
                                                    <Radio.Button value={50}>50%</Radio.Button>
                                                    <Radio.Button value={75}>75%</Radio.Button>
                                                    <Radio.Button value={100}>100%</Radio.Button>
                                                    <Radio.Button value={-1}>Khác</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='GIA_TRI_SO' rules={[{ required: true, message: "Vui lòng chọn giá trị giảm giá." }]}>
                                                <Input prefix="% " type="number" style={{ margin: '20px 0' }} placeholder='Khác'></Input>
                                            </Form.Item>
                                        </>
                                }

                            </>
                        }
                    </Col>
                </Row>


                <br />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>
        </div >
    );
}

export default VoucherEdit;