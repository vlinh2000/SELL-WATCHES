
import { Button, Checkbox, Col, DatePicker, Form, Radio, Row, Space } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { sukienApi } from 'api/sukienApi';
import { uudaiApi } from 'api/uudaiApi';
import ButtonCustom from 'components/ButtonCustom';
import CheckField from 'custom-fields/CheckField';
import InputField from 'custom-fields/InputField';
import PickDateField from 'custom-fields/PickDateField';
import moment from 'moment';
import { fetch_events } from 'pages/Admin/adminSlice';
import Voucher from 'pages/User/components/Voucher';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import './EventEdit.scss';

EventEdit.propTypes = {

};

let schema = yup.object().shape({
    TEN_SK: yup.string().required('Tên sự kiện không được để trống.'),
    TG_BAT_DAU: yup.date().required('Thời gian bắt đầu không được để trống.'),
    TG_KET_THUC: yup.date().required('Thời gian kết thúc không được để trống.'),
    KHUNG_GIO_TU: yup.string().required('Khung giờ từ không được để trống.'),
    KHUNG_GIO_DEN: yup.string().required('Khung giờ đến không được để trống.'),
    VOUCHERS: yup.array().min(1).required('Chưa chọn mã giảm giá')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function EventEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.events);
    const { events: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_vouchers, setOptions_vouchers] = React.useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()



    console.log({ options_vouchers })
    const initialValues = {
        TEN_SK: currentSelected?.TEN_SK || '',
        TG_BAT_DAU: moment(currentSelected?.TG_BAT_DAU),
        TG_KET_THUC: currentSelected?.TG_KET_THUC ? moment(currentSelected?.TG_KET_THUC) : moment(moment().add(2, 'days')),
        KHUNG_GIO_TU: currentSelected?.KHUNG_GIO_TU ? moment('2022-1-1 ' + currentSelected?.KHUNG_GIO_TU) : moment(),
        KHUNG_GIO_DEN: currentSelected?.KHUNG_GIO_DEN ? moment('2022-1-1 ' + currentSelected?.KHUNG_GIO_DEN) : moment(moment().add(1, 'hours')),
        VOUCHERS: currentSelected?.VOUCHERS?.map(v => v.MA_UU_DAI) || []
    }

    const handleSave = async (values) => {
        try {
            const data = {
                TEN_SK: values.TEN_SK,
                TG_BAT_DAU: values.TG_BAT_DAU.utc(true),
                TG_KET_THUC: values.TG_KET_THUC.utc(true),
                KHUNG_GIO_TU: values.KHUNG_GIO_TU.utc(true),
                KHUNG_GIO_DEN: values.KHUNG_GIO_DEN.utc(true),
                VOUCHERS: values.VOUCHERS
            }
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await sukienApi.post(data) : await sukienApi.update(currentSelected.MA_SK, data);
            await dispatch(fetch_events({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/events/view');
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
        const fetchData = async () => {
            try {
                const { result } = await uudaiApi.getAll();
                setOptions_vouchers(result);
            } catch (error) {
                console.log({ error })
            }
        }
        fetchData();
    }, [])


    return (
        <div className='event-edit box'>

            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <Row gutter={[50, 0]}>
                    <Col xs={24} sm={12} md={10} lg={8}>
                        <InputField name='TEN_SK' label='Tên sự kiện' placeHolder='-- Nhập tên sự kiện --' rules={[yupSync]} />
                        <PickDateField
                            showTime
                            name='TG_BAT_DAU' label='Thời gian bắt đầu' placeHolder='-- Chọn thời gian bắt đầu --' rules={[yupSync]}
                        />
                        <PickDateField
                            showTime
                            name='TG_KET_THUC' label='Thời gian kết thúc' placeHolder='-- Chọn thời gian kết thúc --' rules={[yupSync]} />

                        <PickDateField
                            picker='time'
                            name='KHUNG_GIO_TU' label='Khung giờ từ' rules={[yupSync]} placeHolder='-- Chọn khung giờ từ --'
                        />
                        <PickDateField
                            picker='time'
                            name='KHUNG_GIO_DEN' label='Khung giờ đến' rules={[yupSync]} placeHolder='-- Chọn khung giờ đến --'
                        />
                    </Col>
                    <Col xs={24} sm={12} md={14} lg={16}>
                        {/* <CheckField
                            name='VOUCHERS' label='Danh sách mã ưu đãi' rules={[yupSync]}
                            options={options_vouchers}
                        /> */}
                        <p style={{
                            fontSize: '11px',
                            letterSpacing: '0.5px',
                            fontWeight: 500,
                            textTransform: 'uppercase'
                        }}>Danh sách ưu đãi trong sự kiện:</p>
                        <Form.Item name='VOUCHERS'>
                            <Checkbox.Group className='checkbox-custom'>
                                <Row className='voucher-list-choosen'>
                                    {
                                        options_vouchers?.map((voucher, idx) =>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                                <Checkbox style={{ width: '100%' }} disabled={voucher.SU_DUNG} key={idx} value={voucher.MA_UU_DAI}>
                                                    <Voucher quantity={voucher.SO_LUONG_BAN_DAU} name={voucher.TEN_UU_DAI} used={voucher.SU_DUNG} id={voucher.MA_UU_DAI} expire={voucher.HSD} />
                                                </Checkbox>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        {/* {
                            options_vouchers?.map(voucher => <Col md={12}> <Voucher id={voucher.MA_UU_DAI} name={voucher.TEN_UU_DAI} /></Col>)
                        } */}
                    </Col>
                </Row>

                {/* VOUCHER */}
                <br />
                <ButtonCustom type='submit' isLoading={isLoading}>Lưu</ButtonCustom>
            </Form>
        </div >
    );
}

export default EventEdit;