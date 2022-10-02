
import { SyncOutlined } from '@ant-design/icons';
import { Col, Collapse, Form, Pagination, Row, Table, Tag } from 'antd';
import { donhangApi } from 'api/donhangApi';
import { getStatusOrder, numberWithCommas } from 'assets/admin';
import ButtonCustom from 'components/ButtonCustom';
import PickDateField from 'custom-fields/PickDateField';
import moment from 'moment';
import { fetch_orders, fetch_orders_pending, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import './OrderConfirm.scss';

OrderConfirm.propTypes = {

};

let schema = yup.object().shape({
    MA_NCC: yup.string().required('Nhà cung cấp không được để trống.'),
    SAN_PHAM: yup.array().min(1, 'Sản phẩm không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function OrderConfirm(props) {
    const { user } = useSelector(state => state.auth)
    const [loading, setLoading] = React.useState(false);

    const [form] = Form.useForm();
    const {
        loading: { ordersConfirm: isLoading },
        data: { ordersConfirm },
        pagination: { ordersConfirm: pagination, orders: pagination_order } } = useSelector(state => state.adminInfo);

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleConfirm = async (values, MA_DH) => {
        try {
            if (moment().isAfter(values.TG_GIAO_HANG)) return toast.error("Thời gian giao hàng không hợp lệ.")
            const data = { action: 'confirm', ...values }
            setLoading(true);
            const { message } = await donhangApi.update(MA_DH, data);
            await dispatch(fetch_orders_pending({ _limit: pagination._limit, _page: pagination._page, status: JSON.stringify('[0]') }));
            dispatch(fetch_orders({ _limit: pagination_order._limit, _page: pagination_order._page }));
            setLoading(false);
            toast.success(message);
        } catch (error) {
            setLoading(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    // React.useEffect(() => {
    //     form.setFieldValue('SAN_PHAM', listProduct);
    // }, [listProduct])

    // React.useEffect(() => {
    //     const fetchOrdersPending = async () => {
    //         try {
    //             const { result } = await sanphamApi.getAll({ _limit: pagination._limit, _page: pagination._page  });
    //             setOptions_Position(result.map((e) => ({ label: e.TEN_CV, value: e.MA_CV })))
    //         } catch (error) {
    //             console.log({ error });
    //         }
    //     }

    //     fetchOrdersPending();
    // }, [])

    const columns = [
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
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Thành tiền',
            dataIndex: 'GIA',
            render: (text) => numberWithCommas(text)
        },
    ];

    return (
        <div className='order-confirm box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {ordersConfirm?.length < pagination?._limit ? ordersConfirm.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Collapse>
                            {
                                ordersConfirm?.map((order, idx) =>
                                    <Collapse.Panel header="Đơn hàng: HD019302329" key={order.MA_DH}
                                        extra={<Tag icon={<SyncOutlined spin />} color="warning">
                                            {getStatusOrder(order.TRANG_THAI)}
                                        </Tag>}>
                                        <li className='order-confirm__item'>
                                            <div className='order-confirm__item__body'>
                                                <Row gutter={[40, 0]} justify="space-between">
                                                    <Col xs={24} sm={24} md={24} lg={10}>
                                                        <div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>{order.HO_TEN_NGUOI_DAT}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>{order.SDT_NGUOI_DAT}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                                            </div>
                                                            {/* <div className='category-label'>
                                                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{order.MA_UU_DAI}</span>
                                                            </div> */}
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Giảm giá </span><span className='category-label-value'>{numberWithCommas(order.GIAM_GIA)}&nbsp;₫</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Phí ship </span><span className='category-label-value'>{numberWithCommas(order.PHI_SHIP)}&nbsp;₫</span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={10}>
                                                        <div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Hình thức thanh toán </span><span className='category-label-value'>{order.HINH_THUC_THANH_TOAN}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Trạng thái thanh toán </span><span className='category-label-value'>{order.DA_THANH_TOAN == 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>{moment(order.NGAY_DAT_HANG).format('DD-MM-YYYY HH:mm:ss')}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>{order.DIA_CHI}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>{numberWithCommas(order.TONG_TIEN + order.PHI_SHIP)}&nbsp;₫</strong>
                                                            </div>
                                                            <br />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Table
                                                    className='order-confirm__table-detail table-detail'
                                                    pagination={false}
                                                    size='small'
                                                    columns={columns}
                                                    dataSource={order.SAN_PHAM}>
                                                </Table>
                                            </div>
                                            <div className='order-confirm__item__footer'>
                                                <Form layout='vertical' onFinish={(values) => handleConfirm(values, order.MA_DH)}>
                                                    <Row gutter={[40, 0]} align="middle">
                                                        <Col xs={24} sm={6}>
                                                            <PickDateField name='TG_GIAO_HANG' rules={[{ required: true, message: 'Vui lòng chọn ngày.' }]} label='Thời gian giao hàng dự kiến' />
                                                        </Col>
                                                        <Col xs={24} sm={12}>
                                                            <ButtonCustom isLoading={loading} className="btn-info-custom" text='Xác nhận đơn hàng' type='submit' />
                                                            {/* <ButtonCustom className="btn-success-custom" text='Đã nhận được hàng ?' /> */}
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </li>
                                        <br />
                                    </Collapse.Panel>
                                )
                            }
                        </Collapse>
                        {
                            ordersConfirm?.length < 1 && <p style={{ marginTop: 5 }}>Hiện tại không có đơn cần xác nhận.</p>
                        }
                        {
                            pagination._totalPage != 0 &&
                            <Pagination
                                style={{ marginTop: '9rem' }}
                                current={pagination._page}
                                pageSize={1}
                                total={pagination._totalPage}
                                onChange={(page) => dispatch(savePagination({ screen: 'ordersConfirm', page }))} />
                        }

                    </>

            }



        </div>
    );
}

export default OrderConfirm;