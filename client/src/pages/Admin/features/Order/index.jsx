import React from 'react';

import { CaretRightOutlined, DeleteOutlined, EllipsisOutlined, FileSearchOutlined, PhoneOutlined, PushpinOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Empty, Form, Pagination, Popconfirm, Row, Select, Table, Tabs, Tag } from 'antd';
import { donhangApi } from 'api/donhangApi';
import { getStatusOrder, getStatusOrderColor, numberWithCommas } from 'assets/admin';
import moment from 'moment';
import { fetch_orders, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Order.scss';
import ButtonCustom from 'components/ButtonCustom';
import SelectField from 'custom-fields/SelectField';
import PickDateField from 'custom-fields/PickDateField';
import InputField from 'custom-fields/InputField';
import * as yup from 'yup';
import OrderEdit from './OrderEdit';


Order.propTypes = {

};



const options_payments = [
    { label: 'Tất cả', value: -1 },
    { label: 'Thanh toán khi nhận hàng', value: 'cod' },
    { label: 'Thanh toán online', value: 'momo_wallet' },
]


let schema = yup.object().shape({
    TG_DAT_HANG_TU: yup.string(),
    TG_DAT_HANG_DEN: yup.string().when('TG_DAT_HANG_TU', (TG_DAT_HANG_TU, schema) => {
        console.log({ TG_DAT_HANG_TU, schema })
        if (TG_DAT_HANG_TU) {
            return yup.string().required();
        }
    }),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function Order(props) {

    const [isLoading, setIsLoading] = React.useState(false);
    const [searchInfo, setSearchInfo] = React.useState({});
    const [refreshOrders, setRefreshOrders] = React.useState(false);
    const [isShowAreaEdit, setIsShowAreaEdit] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState();


    const [orders, setOrders] = React.useState([
        { totalRecord: 0, data: [], orderStatusString: 'Đơn hàng chờ xử lý ' },
        { totalRecord: 0, data: [], orderStatusString: 'Đơn hàng đang giao ' },
        { totalRecord: 0, data: [], orderStatusString: 'Đơn hàng đã giao ' },
        { totalRecord: 0, data: [], orderStatusString: 'Đơn hàng đã hủy ' }
    ]);

    const [pagination, setPagination] = React.useState([
        { _limit: 5, _page: 1, _totalPage: 1 },
        { _limit: 5, _page: 1, _totalPage: 1 },
        { _limit: 5, _page: 1, _totalPage: 1 },
        { _limit: 5, _page: 1, _totalPage: 1 }
    ]);
    // const {
    //     loading: { orders: isLoading },
    //     data: { orders },
    //     pagination: { orders: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const onViewAndConfirm = (data) => {
    //     dispatch(prepareDataEdit({ screen: 'orders', mode: 'EDIT', data }));
    //     navigate('/admin/orders/confirm');
    // }

    const onDelete = async (id) => {
        try {
            const { message } = await donhangApi.delete(id);
            // await dispatch(fetch_orders({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const fetchOrders = async (status) => {
        try {
            setIsLoading(true);
            const { result, totalRecord } = await donhangApi.getAll({ _limit: pagination[status]._limit, _page: pagination[status]._page, status: JSON.stringify(`[${status}]`), action: 'search', searchInfo: JSON.stringify(searchInfo) });
            setOrders(prev => {
                const newOrders = [...prev];
                newOrders[status].totalRecord = totalRecord;
                newOrders[status].data = result;
                return newOrders;

            })
            setPagination(prev => {
                const _totalPage = Math.ceil(totalRecord / prev[status]._limit);
                const newPagination = [...prev];
                newPagination[status] = { ...newPagination[status], _totalPage };
                return newPagination;
            })
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
        }
    }

    // wait confirm
    React.useEffect(() => {
        fetchOrders(0);
    }, [pagination[0]._page, pagination[0]._limit, searchInfo, refreshOrders]);

    // shipping
    React.useEffect(() => {
        fetchOrders(1);
    }, [pagination[1]._page, pagination[1]._limit, searchInfo, refreshOrders]);

    // delivered
    React.useEffect(() => {
        fetchOrders(2);
    }, [pagination[2]._page, pagination[2]._limit, searchInfo, refreshOrders]);

    // cancled
    React.useEffect(() => {
        fetchOrders(3);
    }, [pagination[3]._page, pagination[3]._limit, searchInfo, refreshOrders]);


    // <Popconfirm
    //     title={`Bạn có chắc muốn xóa đơn hàng ID [${text}]`}
    //     onConfirm={() => { onDelete(text) }}
    //     okText="Yes"
    //     cancelText="No">
    //     {/* <Button style={{ marginLeft: 5 }} icon={<EyeOutlined />}></Button> */}
    // <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
    // </Popconfirm>

    const handleRefresh = () => {
        setRefreshOrders(prev => !prev);
    }

    const handleSearch = (values) => {
        const data = values.HINH_THUC_THANH_TOAN === -1 ? {
            MA_DH: values.MA_DH,
            HO_TEN_NGUOI_DAT: values.HO_TEN_NGUOI_DAT,
            SDT_NGUOI_DAT: values.SDT_NGUOI_DAT,
            TG_DAT_HANG_TU: values.TG_DAT_HANG_TU,
            TG_DAT_HANG_DEN: values.TG_DAT_HANG_DEN,
        } : values;
        setSearchInfo(data);
    }

    const columnsExtend = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'MA_SP'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'TEN_SP',
        },
        {
            title: 'Số lượng',
            dataIndex: 'SO_LUONG'
        },
        {
            title: 'Đơn giá',
            dataIndex: 'DON_GIA',
            render: (text) => numberWithCommas(text) + ' ₫'
        },
        {
            title: 'Thành tiền',
            dataIndex: 'GIA',
            render: (text) => numberWithCommas(text) + ' ₫'
        },
    ];

    const initialValues = {
        MA_DH: '',
        HO_TEN_NGUOI_DAT: '',
        SDT_NGUOI_DAT: '',
        TG_DAT_HANG_TU: '',
        TG_DAT_HANG_DEN: '',
        HINH_THUC_THANH_TOAN: -1,
    }

    const handleResetSearch = () => {
        form.resetFields();
        setSearchInfo({});
    }

    const handleSwitchAreaEdit = (isShow) => {
        setIsShowAreaEdit(isShow);
        !isShow && setCurrentOrder({});
    }

    const [form] = Form.useForm();
    return (
        <div className='orders box'>
            <div className='orders__search-area'>
                <Form
                    onFinish={handleSearch}
                    form={form}
                    initialValues={initialValues}
                    layout='vertical'>
                    <Row gutter={[20, 0]}>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <InputField name='MA_DH' placeHolder='-- Nhập mã đơn hàng --' label='Mã đơn hàng' />
                            <InputField name='HO_TEN_NGUOI_DAT' placeHolder='-- Nhập họ tên người đặt --' label='Họ tên người đặt' />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <InputField name='SDT_NGUOI_DAT' placeHolder='-- Nhập SĐT người đặt --' label='SDT người đặt' type='number' />
                            <SelectField name='HINH_THUC_THANH_TOAN' options={options_payments} label='Hình thức thanh toán' placeHolder='-- Chọn hình thức thanh toán --' />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <PickDateField name='TG_DAT_HANG_TU' placeHolder='-- Chọn thời gian đặt hàng từ --' label='Thời gian đặt hàng từ' rules={[yupSync]} />
                            <PickDateField name='TG_DAT_HANG_DEN' placeHolder='-- Chọn thời gian đặt hàng đến --' label='Thời gian đặt hàng đến' rules={[yupSync]} />
                            {/* <SelectField name='TRANG_THAI' options={options_orderStatus} label='Trạng thái đơn hàng' placeHolder='-- Chọn trạng thái đơn hàng --' /> */}
                        </Col>
                    </Row>
                    <br />
                    <div style={{ display: 'flex' }}>
                        <ButtonCustom type='submit'>Tìm kiếm</ButtonCustom>
                        <ButtonCustom style={{ marginLeft: 10 }} onClick={handleResetSearch} type='button'>Cài lại</ButtonCustom>
                    </div>
                </Form>
            </div>
            {
                // 
                <>
                    <Tabs type="card">
                        {
                            orders?.map((aboutOrder, idx) => {
                                return <Tabs.TabPane tab={<div> {aboutOrder.orderStatusString} <span style={{ fontSize: 12 }}>[{aboutOrder.totalRecord}]</span></div>} key={idx + 1}>
                                    {aboutOrder.data?.length > 0 && <p style={{ marginLeft: 10 }}>Tổng số: {aboutOrder.data?.length < pagination[idx]._limit ? aboutOrder.data.length : pagination[idx]._limit}/ {aboutOrder.totalRecord} bản ghi</p>}
                                    <Collapse
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        className="site-collapse-custom-collapse">
                                        {
                                            isLoading ?
                                                <SkeletonCustom rows={5} />
                                                :
                                                aboutOrder.data?.map((order, index) =>
                                                    <Collapse.Panel header={<><span style={{ minWidth: 150, display: 'inline-block' }}>Đơn hàng: {order.MA_DH} </span> <FileSearchOutlined /><span> {order.HO_TEN_NGUOI_DAT}</span> ~ <span> {order.SDT_NGUOI_DAT}</span> </>} key={order.MA_DH}
                                                        extra={<Tag color={order.HINH_THUC_THANH_TOAN === 'cod' ? 'cyan' : 'purple'}>{order.HINH_THUC_THANH_TOAN === 'cod' ? "Thanh toán khi nhận hàng" : "Thanh toán online"}</Tag>}>
                                                        <li className='order-confirm__item'>
                                                            <div className='order-confirm__item__body'>
                                                                <Row gutter={[50, 0]} justify="space-between">
                                                                    <Col xs={24} sm={24} md={24} lg={8}>
                                                                        <div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>{order.HO_TEN_NGUOI_DAT}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>{order.SDT_NGUOI_DAT}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Email</span><span className='category-label-value'>{order.EMAIL_NGUOI_DAT}</span>
                                                                            </div>

                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{order.MA_UU_DAI || 'Không áp dụng'}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Giảm giá </span><span className='category-label-value'>{numberWithCommas(order.GIAM_GIA)}&nbsp;₫</span>
                                                                            </div>


                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={8}>
                                                                        <div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Hình thức thanh toán </span><span className='category-label-value'>{order.HINH_THUC_THANH_TOAN}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Trạng thái thanh toán </span><span className='category-label-value'>{order.DA_THANH_TOAN == 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Phí ship </span><span className='category-label-value'>{numberWithCommas(order.PHI_SHIP)}&nbsp;₫</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Trạng thái đơn hàng </span><span className='category-label-value'>{getStatusOrder(order.TRANG_THAI)}</span>
                                                                            </div>


                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={24} lg={8}>
                                                                        <div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>{moment(order.NGAY_DAT_HANG).format('DD-MM-YYYY HH:mm:ss')}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>  {order.TRANG_THAI === 3 ? 'Thời gian hủy đơn ' : 'Ngày giao hàng'} {order.TRANG_THAI == 1 ? '(dự kiến)' : ''}</span><span className='category-label-value'> {order.TRANG_THAI === 3 ? moment(order.CAP_NHAT).format('DD-MM-YYYY HH:mm:ss') : order.TG_GIAO_HANG ? moment(order.TG_GIAO_HANG).format('DD-MM-YYYY HH:mm:ss') : 'Chưa xác định'} </span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Ghi chú</span><span className='category-label-value'>{order.GHI_CHU}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>{order.DIA_CHI}</span>
                                                                            </div>
                                                                            <div className='category-label'>
                                                                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>{numberWithCommas(order.MPVC ? order.TONG_TIEN : order.TONG_TIEN + order.PHI_SHIP)}&nbsp;₫</strong>
                                                                            </div>
                                                                            <br />
                                                                        </div>

                                                                    </Col>
                                                                </Row>
                                                                <Table
                                                                    // className='order-confirm__table-detail'
                                                                    pagination={false}
                                                                    size='small'
                                                                    columns={columnsExtend}
                                                                    dataSource={order.SAN_PHAM}>
                                                                </Table>
                                                            </div>
                                                            <div className='order-confirm__item__footer'>
                                                                {
                                                                    order.TRANG_THAI < 2 &&
                                                                    <button onClick={() => {
                                                                        handleSwitchAreaEdit(true);
                                                                        setCurrentOrder(order);
                                                                    }}
                                                                        className='button-1'>Cập nhật đơn hàng</button>
                                                                }
                                                                {/* <PickDateField label='Ngày giao hàng dự kiến' />
                                                                    <p>Xử lý đơn hàng</p> */}
                                                                {/* <ButtonCustom isLoading={loading} className="btn-info-custom"  text='Đã giao hàng hoàn tất.' /> */}
                                                                {/* <ButtonCustom className="btn-success-custom" text='Đã nhận được hàng ?' /> */}
                                                            </div>
                                                        </li>
                                                        <br />
                                                    </Collapse.Panel>
                                                )
                                        }
                                    </Collapse>
                                    {
                                        !isLoading && (
                                            aboutOrder.data?.length > 0 ?
                                                <Pagination
                                                    pageSize={1}
                                                    current={pagination[idx]._page}
                                                    total={pagination[idx]._totalPage}
                                                    onChange={(page) => setPagination(prev => {
                                                        const newPagination = [...prev];
                                                        newPagination[idx]._page = page;
                                                        return newPagination;
                                                    })} ></Pagination>
                                                : <div style={{ marginLeft: 10 }}>Không có dữ liệu.</div>
                                        )
                                    }
                                </Tabs.TabPane>
                            })
                        }

                    </Tabs>,

                </>

            }
            <OrderEdit onRefresh={handleRefresh} order={currentOrder} switch_areaEdit={handleSwitchAreaEdit} isShowAreaEdit={isShowAreaEdit} />
        </div>
    );
}

export default Order;

