import React from 'react';
import PropTypes from 'prop-types';
import { CodeOutlined, DeleteOutlined, EditOutlined, PlusOutlined, QuestionOutlined, SaveOutlined, SettingFilled } from '@ant-design/icons';
import { Button, Col, Collapse, Drawer, Form, Input, Modal, Popconfirm, Radio, Row, Space, Table, Tag, Tooltip } from 'antd';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import ButtonCustom from 'components/ButtonCustom';
import './Payments.scss';
import { useDispatch, useSelector } from 'react-redux';
import { switch_chooseAddressModal, switch_screenLogin, switch_voucherModal } from 'pages/User/userSlice';
import * as yup from 'yup';
import { numberWithCommas } from 'assets/admin';
import { getTotalPrice } from 'assets/common';
import axios from 'axios';
import ChooseAddressModal from 'pages/User/components/ChooseAddressModal';
import { diachighApi } from 'api/diachighApi';
import { FROM_DESTRICT_ID } from 'constants/commonContants';
import { Navigate, useNavigate } from 'react-router-dom';
import VoucherModal from 'pages/User/components/VoucherModal';

Payments.propTypes = {

};

function NotFoundAddress() {
    return <Tooltip title="Chọn địa chỉ để xem phí vận chuyển">
        <QuestionOutlined style={{ cursor: 'pointer' }} />
    </Tooltip>
}


let schema = yup.object().shape({
    HO_TEN: yup.string().required('Họ tên không được để trống.'),
    SO_DIEN_THOAI: yup.string()
        .required("Số điện thoại không được để trống.")
        .matches(/^[0-9]+$/, "Vui lòng nhập số.")
        .min(10, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)')
        .max(11, 'Số điện thoại chưa hợp lệ (yêu cầu 10 or 11 số)'),
    EMAIL: yup
        .string().required('Email không được để trống.').email("Email không hợp lệ."),
    DIA_CHI_GH: yup.string().required('Chưa chọn địa chỉ giao hàng.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function Payments(props) {

    const [showUseVoucherForm, setShowUseVoucherForm] = React.useState(false);
    const [deliveryAddressList, setDeliveryAddressList] = React.useState([]);
    const [isReload, setIsReload] = React.useState(false);
    const { cart, payments: { voucher } } = useSelector(state => state.userInfo);
    const { isAuth, user } = useSelector(state => state.auth);

    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [feeShip, setFeeShip] = React.useState(0);
    const [reloadFeeShip, setReloadFeeShip] = React.useState(false);
    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [isVoucherValid, setIsVoucherValid] = React.useState(false)
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const initialValues = {
        HO_TEN: user?.HO_TEN || '',
        SO_DIEN_THOAI: user?.SO_DIEN_THOAI || '',
        EMAIL: user?.EMAIL || '',
        HINH_THUC_THANH_TOAN: 'normal',
        DIA_CHI_GH: '',
        VOUCHER: ''
    }

    React.useEffect(() => {
        form.setFieldsValue(user)
    }, [user])

    React.useEffect(() => {
        const fetchDeliveryAddress = async () => {
            try {
                const { result } = await diachighApi.getAll();
                setDeliveryAddressList(result);
                form.setFieldValue('DIA_CHI_GH', result.length < 1 ? '' : result[0].DIA_CHI)
                setFeeShip(prev => result.length < 1 ? 0 : prev)
            } catch (error) {
                console.log({ error });
            }
        }

        user?.USER_ID && fetchDeliveryAddress();
    }, [user?.USER_ID, isReload])

    const handleReloadDeliveryAddress = () => {
        setIsReload(prev => !prev);
    }

    React.useEffect(() => {
        form.setFieldValue('VOUCHER', voucher?.MA_UU_DAI);
    }, [voucher])

    React.useEffect(() => {
        const fetchAllProvinces = async () => {
            try {
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_PROVINCE, { headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                console.log({ data });
                setOptions_Provinces(data.map((e) => ({ label: e.NameExtension[1], value: e.NameExtension[1] + ' (' + e.ProvinceID + ')', code: e.ProvinceID })))
            } catch (error) {
                console.log({ error });
            }
        }

        !isAuth && fetchAllProvinces();
    }, [isAuth])

    React.useEffect(() => {
        const fetchAllDistrictInProvinces = async () => {
            try {
                if (addressCode.provincesCode == null) {
                    setOptions_district([]);
                    return;
                }
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_DISTRICT, { params: { 'province_id': addressCode.provincesCode }, headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                console.log({ data })
                setOptions_district(data.map((e) => ({ label: e.DistrictName, value: e.DistrictName + ' (' + e.DistrictID + ')', code: e.DistrictID })))
            } catch (error) {
                console.log({ error });
            }
        }
        !isAuth && fetchAllDistrictInProvinces();
    }, [isAuth, addressCode.provincesCode])

    React.useEffect(() => {
        const fetchAllWardsInDistrict = async () => {
            try {
                if (addressCode.districtCode == null) {
                    setOptions_wards([]);
                    return;
                }
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_WARD, { params: { 'district_id': addressCode.districtCode }, headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                setOptions_wards(data.map((e) => ({ label: e.WardName, value: e.WardName + ' (' + e.WardCode + ')', code: e.WardCode })))
            } catch (error) {
                console.log({ error });
            }
        }

        !isAuth && fetchAllWardsInDistrict();
    }, [isAuth, addressCode.districtCode])


    React.useEffect(() => {
        const fetchFeeShip = async () => {
            try {
                const DIA_CHI_GH = form.getFieldValue("DIA_CHI_GH");
                if (!DIA_CHI_GH) return;

                const [wardCode, districtId,] = DIA_CHI_GH.split(', ')?.map(ad => ad.match(/[0-9]/g).join(""))
                const totalPriceOrder = getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO');
                const height = cart.length * 15;
                const weight = cart.length * 400;

                const params = {
                    service_type_id: 2, // GHTK
                    insurance_value: totalPriceOrder, // TOTAL PRICE ORDER
                    coupon: null,
                    from_district_id: FROM_DESTRICT_ID, // FROM ME
                    to_district_id: districtId, //
                    to_ward_code: wardCode,
                    height,
                    length: 50,
                    weight,
                    width: 30
                }
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_CALCULATE_FEE, { params, headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                setFeeShip((deliveryAddressList.length < 1 && isAuth) ? 0 : data.total);
            } catch (error) {
                console.log({ error })
            }
        }
        cart.length < 1 ? navigate('/', { replace: true }) : fetchFeeShip();
    }, [deliveryAddressList, reloadFeeShip, cart])


    const handleOrder = (values) => {
        console.log({ values, cart, feeShip });
    }

    const handleUseVoucher = (values) => {
        // console.log({ values, cart, feeShip });
        setIsVoucherValid(true)
    }

    return (
        <div className='wrapper-content'>
            <div className="payments">
                {
                    !isAuth &&
                    <div className='note'>
                        Bạn đã có tài khoản? <a href='' onClick={(e) => {
                            e.preventDefault();
                            dispatch(switch_screenLogin(true))
                        }}>Ấn vào đây để đăng nhập</a>
                    </div>
                }
                <Form
                    onValuesChange={(values) => {
                        // if (values.DIA_CHI && form.getFieldValue('')) {

                        // }
                        values.DIA_CHI_GH && setReloadFeeShip(prev => !prev)
                    }}
                    form={form}
                    initialValues={initialValues}
                    onFinish={handleOrder}
                    layout='vertical'>
                    <div className='note'>
                        <CodeOutlined />  Có mã ưu đãi? <a onClick={(e) => {
                            e.preventDefault();
                            setShowUseVoucherForm(prev => !prev);
                        }}>Ấn vào đây để nhập mã</a>
                        <Collapse activeKey={[showUseVoucherForm ? '1' : '0']} >
                            <Collapse.Panel showArrow={false} key="1">
                                <p>Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới. <a onClick={() => dispatch(switch_voucherModal(true))}><Tag color='#55acee'>Danh sách mã ưu đãi của tôi.</Tag></a></p>
                                <Row>
                                    <Col lg={20}>
                                        <InputField name='VOUCHER' />
                                    </Col>
                                    <Col lg={4}>
                                        <ButtonCustom onClick={handleUseVoucher} style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Áp dụng" />
                                    </Col>
                                </Row>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                    <div className="main-content">
                        <Row gutter={[30, 0]}>
                            <Col xs={24} sm={24} md={10} lg={13}>
                                <div className="left-side">
                                    <h1>Thông tin thanh toán</h1>

                                    <InputField name='HO_TEN' label='Họ tên' required rules={[yupSync]} />
                                    <InputField name='SO_DIEN_THOAI' label='Số điện thoại' required rules={[yupSync]} />
                                    <InputField name='EMAIL' label='Địa chỉ email' required rules={[yupSync]} />
                                    {
                                        !isAuth &&
                                        <>
                                            <SelectField
                                                required
                                                label='Tỉnh/Thành phố'
                                                rules={[{ required: true, message: '...' }]}
                                                onChange={(_, options) => {
                                                    form.setFieldValue('DISTRICT', '');
                                                    form.setFieldValue('WARD', '');
                                                    setAddressCode(prev => ({ ...prev, provincesCode: options.code, districtCode: null }))
                                                }}
                                                name="PROVINCE" options={options_Provinces} />

                                            <SelectField
                                                required
                                                label='Quận/Huyện'
                                                rules={[{ required: true, message: '...' }]}
                                                onChange={(_, options) => {
                                                    form.setFieldValue('WARD', '');
                                                    setAddressCode(prev => ({ ...prev, districtCode: options.code, wardsCode: null }))
                                                }}
                                                name="DISTRICT" options={options_district} />
                                            <SelectField
                                                onChange={(value) => {
                                                    const DIA_CHI_GH = value + ', ' + form.getFieldValue('DISTRICT') + ', ' + form.getFieldValue('PROVINCE')
                                                    form.setFieldValue('DIA_CHI_GH', DIA_CHI_GH);
                                                    setReloadFeeShip(prev => !prev)
                                                }}
                                                required
                                                label='Phường/Xã'
                                                rules={[{ required: true, message: '...' }]}
                                                name="WARD" options={options_wards} />
                                        </>
                                    }
                                    <InputField
                                        name='GHI_CHU'
                                        label='Ghi chú đơn hàng'
                                        type='textarea'
                                        rows={isAuth ? 10 : 3}
                                        placeHolder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                                    // rules={[yupSync]}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={14} lg={11}>
                                <div className="right-side">

                                    <h1>Đơn hàng của bạn</h1>
                                    <div className='title-custom'>
                                        <span>Sản phẩm</span>
                                        <span>Tổng cộng</span>
                                    </div>
                                    <div>
                                        {
                                            cart?.map((product, idx) =>
                                                <div key={idx} className='category-label'>
                                                    <span className='category-label-key'>
                                                        <span className='name'>{product?.TEN_SP}</span>&nbsp;
                                                        <div><strong >x {product?.SL_TRONG_GIO}</strong></div>
                                                    </span>
                                                    <strong className='category-label-value'>{numberWithCommas(product.SL_TRONG_GIO * product.GIA_BAN)} ₫</strong>
                                                </div>
                                            )
                                        }

                                        <div className='category-label'>
                                            <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Phí vận chuyển </span><span className='category-label-value'>{feeShip ? numberWithCommas(feeShip) + ' ₫' : <NotFoundAddress />}</span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{isVoucherValid ? voucher.MA_UU_DAI : 'không áp dụng'} </span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>{numberWithCommas(getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO') + feeShip)} ₫</strong>
                                        </div>
                                        <br />
                                        <div>
                                            <div style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                marginBottom: 10
                                            }}>Phương thức thanh toán</div>
                                            <Form.Item name="HINH_THUC_THANH_TOAN">
                                                <Radio.Group>
                                                    <Space direction="vertical" >
                                                        <Radio checked value='normal'>Thanh toán khi nhận hàng</Radio>
                                                        <Radio value='zalopay'>Thanh toán ZaloPay</Radio>
                                                    </Space>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                        <br />
                                        {
                                            isAuth &&
                                            <div>
                                                <div className='category-label' style={{ border: 0 }}>
                                                    <span className='category-label-key'>
                                                        <div style={{
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                            marginBottom: 10
                                                        }}>Địa chỉ giao hàng </div>
                                                    </span>
                                                    <strong className='category-label-value'>
                                                        <a onClick={() => dispatch(switch_chooseAddressModal(true))}>
                                                            <SettingFilled />
                                                        </a></strong>
                                                </div>
                                                <ChooseAddressModal onReload={handleReloadDeliveryAddress} addressList={deliveryAddressList} />

                                                {
                                                    deliveryAddressList.length < 1 &&
                                                    <p>Vui lòng chọn địa chỉ giao hàng</p>
                                                }
                                                <Form.Item name="DIA_CHI_GH" rules={[yupSync]}>
                                                    <Radio.Group>
                                                        <Space direction="vertical" >
                                                            {

                                                                deliveryAddressList?.map((address, idx) =>
                                                                    <Radio key={idx} value={address.DIA_CHI}>{address.DIA_CHI?.replace(/[(0-9)]/g, '')}</Radio >
                                                                )
                                                            }
                                                        </Space>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>

                                        }
                                        <br />
                                        {/* </Form>  */}
                                        <ButtonCustom type='submit' style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Đặt hàng" />
                                        {
                                            !isAuth && <InputField name='DIA_CHI_GH' type='hidden' />
                                        }
                                    </div>
                                </div>

                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
            <VoucherModal />
        </div >
    );
}

export default Payments;