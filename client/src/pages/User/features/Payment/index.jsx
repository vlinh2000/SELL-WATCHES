import React from 'react';
import PropTypes from 'prop-types';
import { CodeOutlined, ConsoleSqlOutlined, DeleteOutlined, EditOutlined, PlusOutlined, QuestionOutlined, SaveOutlined, SearchOutlined, SettingFilled } from '@ant-design/icons';
import { Button, Col, Collapse, Drawer, Form, Input, Modal, Popconfirm, Radio, Row, Space, Table, Tag, Tooltip } from 'antd';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import ButtonCustom from 'components/ButtonCustom';
import './Payments.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_my_orders, fetch_my_vouchers, resetCart, selectVoucher, switch_chooseAddressModal, switch_screenLogin, switch_voucherModal } from 'pages/User/userSlice';
import * as yup from 'yup';
import { numberWithCommas } from 'assets/admin';
import { getTotalPrice } from 'assets/common';
import axios from 'axios';
import ChooseAddressModal from 'pages/User/components/ChooseAddressModal';
import { diachighApi } from 'api/diachighApi';
import { FROM_DESTRICT_ID } from 'constants/commonContants';
import { Navigate, useNavigate } from 'react-router-dom';
import VoucherModal from 'pages/User/components/VoucherModal';
import toast from 'react-hot-toast';
import { donhangApi } from 'api/donhangApi';
import { handleMomoPayment } from 'assets/payment';
import CheckField from 'custom-fields/CheckField';

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
    const { cart, payments: { voucher }, pagination: { myOrders: pagination } } = useSelector(state => state.userInfo);
    const { isAuth, user } = useSelector(state => state.auth);

    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [feeShip, setFeeShip] = React.useState(0);
    const [reloadFeeShip, setReloadFeeShip] = React.useState(false);
    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const [isVoucherValid, setIsVoucherValid] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [voucherValue, setVoucherValue] = React.useState(0)
    const [totalPriceOrder, setTotalPriceOrder] = React.useState(() => getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO'));


    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const initialValues = {
        HO_TEN: user?.HO_TEN || '',
        SO_DIEN_THOAI: user?.SO_DIEN_THOAI || '',
        EMAIL: user?.EMAIL || '',
        HINH_THUC_THANH_TOAN: 'cod',
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
                const fee = Math.ceil(data.total / 1000) * 1000;
                console.log({ fee })
                setFeeShip((deliveryAddressList.length < 1 && isAuth) ? 0 : fee);
            } catch (error) {
                console.log({ error })
            }
        }
        cart.length < 1 ? navigate('/', { replace: true }) : fetchFeeShip();
    }, [deliveryAddressList, reloadFeeShip, cart])

    React.useEffect(() => {
        console.log({ feeShip })
    }, [feeShip])


    const handleOrder = async (values) => {
        try {
            setIsLoading(true);
            const data = {
                USER_ID: user?.USER_ID,
                DIA_CHI_GH: values.DIA_CHI_GH.replace(/[(0-9)]/g, ''),
                HINH_THUC_THANH_TOAN: values.HINH_THUC_THANH_TOAN,
                GHI_CHU: values.GHI_CHU, HO_TEN_NGUOI_DAT: values.HO_TEN,
                SDT_NGUOI_DAT: values.SO_DIEN_THOAI, EMAIL_NGUOI_DAT: values.EMAIL,
                MA_UU_DAI: voucher?.MA_UU_DAI,
                GIAM_GIA: voucherValue, TONG_TIEN: voucher?.MPVC ? totalPriceOrder : totalPriceOrder - feeShip,
                DA_THANH_TOAN: 0,
                PHI_SHIP: feeShip,
                SAN_PHAM: JSON.stringify(cart?.map((sp) => ({ MA_SP: sp.MA_SP, SO_LUONG: sp.SL_TRONG_GIO, DON_GIA: sp.GIA_BAN, GIA: sp.GIA_BAN * sp.SL_TRONG_GIO, GIA_GOC: sp.GIA_GOC })))
            }

            switch (values.HINH_THUC_THANH_TOAN) {
                // case 'zalopay_wallet': 
                case 'momo_wallet': {
                    // data.items = cart?.map((sp) => ({ id: sp.MA_SP, name: sp.TEN_SP, category: sp.TEN_LOAI_SP, imageUrl: sp.HINH_ANH, quantity: sp.SL_TRONG_GIO, price: sp.GIA_BAN, totalPrice: sp.GIA_BAN * sp.SL_TRONG_GIO, currency: 'VND' }))
                    const params = { wallet: 'momo_wallet', data: JSON.stringify(data) };
                    const { result } = await donhangApi.createPayment(params);
                    window.location.href = result.payUrl
                    break;
                }
                default:
                    const { message } = await donhangApi.post(data);
                    setIsLoading(false);
                    toast.success(message);
                    dispatch(fetch_my_orders({ action: 'get_my_orders', _limit: pagination._limit, _page: pagination._page }));
                    dispatch(fetch_my_vouchers());
                    dispatch(selectVoucher(null))
                    if (isAuth) {
                        navigate('/profile', { replace: true, state: { historyOrder: true } })
                    } else {
                        navigate('/', { replace: true });
                    }
            }

        } catch (error) {
            setIsLoading(false);
            // toast.error(error.response.data.message);
            console.log({ error })
        }
    }

    React.useEffect(() => {
        if (!voucher) return;
        // apply voucher
        const totalPriceWithShip = getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO') + feeShip;
        if (voucher.MPVC) {
            setVoucherValue(feeShip);
        } else {
            if (voucher.DON_VI_GIAM === '%') {
                const value = totalPriceWithShip * (voucher.GIA_TRI / 100);
                setVoucherValue(value);
            } else {
                setVoucherValue(voucher.GIA_TRI);
            }
        }

        setIsVoucherValid(true);
    }, [voucher, feeShip])

    React.useEffect(() => {
        setTotalPriceOrder(getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO') + feeShip - voucherValue);
    }, [feeShip, voucherValue])

    return (
        <div className='wrapper-content'>
            <div className="payments">
                <Form
                    onValuesChange={(values) => {
                        values.DIA_CHI_GH && setReloadFeeShip(prev => !prev)
                    }}
                    form={form}
                    initialValues={initialValues}
                    onFinish={handleOrder}
                    layout='vertical'>
                    {/* <div className='note'>
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
                    </div> */}
                    <div className="main-content">
                        <Row gutter={[30, 0]}>
                            <Col xs={24} sm={24} md={24} lg={10} xl={12}>
                                <div className="left-side">
                                    <h1>Thông tin thanh toán</h1>

                                    <InputField name='HO_TEN' label='Họ tên' required rules={[yupSync]} placeHolder="-- Nhập họ tên --" />
                                    <InputField name='SO_DIEN_THOAI' label='Số điện thoại' required rules={[yupSync]} placeHolder="-- Nhập số điện thoại --" />
                                    <InputField name='EMAIL' label='Email' required rules={[yupSync]} placeHolder="-- Nhập email --" />
                                    <InputField
                                        name='GHI_CHU'
                                        label='Ghi chú đơn hàng'
                                        type='textarea'
                                        rows={10}
                                        placeHolder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                                    // rules={[yupSync]}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={14} xl={12}>
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
                                                    <span className='category-label-key' style={{ whiteSpace: 'nowrap' }}>
                                                        <span className='name'>{product?.TEN_SP}</span>&nbsp;
                                                        <span > ~ x{product?.SL_TRONG_GIO}</span>
                                                    </span>
                                                    <span className='category-label-value'>{numberWithCommas(product.SL_TRONG_GIO * product.GIA_BAN)} ₫</span>
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
                                            <span className='category-label-key'>Mã ưu đãi <a onClick={() => dispatch(switch_voucherModal(true))}><Tag color='#55acee'><SearchOutlined /></Tag></a>  </span><span className='category-label-value'>{isVoucherValid ? `${voucher.MA_UU_DAI} (${voucher.MPVC ? 'Miễn phí vận chuyển' : `Giảm ${numberWithCommas(voucher.GIA_TRI)} ${voucher.DON_VI_GIAM}`}) ` : 'không áp dụng'} </span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Tổng tiền </span><span className='category-label-value'>{numberWithCommas(getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO') + feeShip)} ₫</span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Giảm giá </span><span className='category-label-value'> {voucherValue ? '- ' + numberWithCommas(voucherValue) : 0} ₫</span>
                                        </div>
                                        <div className='category-label'>
                                            <span className='category-label-key'>Tổng cộng </span><strong style={{ fontSize: 20 }} className='category-label-value'>{numberWithCommas(totalPriceOrder)} ₫</strong>
                                        </div>
                                        <br />

                                        <div>
                                            <div className='title-custom'>Phương thức thanh toán</div>
                                            <CheckField
                                                direction='vertical'
                                                name="HINH_THUC_THANH_TOAN"
                                                type='radio-box'
                                                options={[
                                                    { label: 'Thanh toán khi nhận hàng (COD)', value: 'cod' },
                                                    { label: 'Thanh toán Momo (MOMO_WALLET)', value: 'momo_wallet' },
                                                ]}
                                            />
                                        </div>
                                        {
                                            isAuth &&
                                            <div>
                                                <div className='category-label title-custom' style={{ border: 0 }}>
                                                    <span className='category-label-key'>
                                                        <div >Địa chỉ giao hàng </div>
                                                    </span>
                                                    <strong className='category-label-value'>
                                                        <a onClick={() => dispatch(switch_chooseAddressModal(true))}>
                                                            <SettingFilled />
                                                        </a></strong>
                                                </div>
                                                <ChooseAddressModal onReload={handleReloadDeliveryAddress} addressList={deliveryAddressList} />
                                                {
                                                    deliveryAddressList.length < 1 &&
                                                    <p className='alert-not-address-choosen'>Vui lòng chọn địa chỉ giao hàng</p>
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
                                        {/* </Form>  */}
                                        <ButtonCustom isLoading={isLoading} type='submit' style={{ width: '100%', justifyContent: 'center' }} >Đặt hàng</ButtonCustom>
                                        {/* {
                                            !isAuth && <InputField name='DIA_CHI_GH' type='hidden' />
                                        } */}
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