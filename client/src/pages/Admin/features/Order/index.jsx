import React from 'react';

import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Pagination, Popconfirm, Row, Select, Table, Tag } from 'antd';
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

Order.propTypes = {

};


function Order(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { orders: isLoading },
        data: { orders },
        pagination: { orders: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'orders', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onViewAndConfirm = (data) => {
        dispatch(prepareDataEdit({ screen: 'orders', mode: 'EDIT', data }));
        navigate('/admin/orders/confirm');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await donhangApi.delete(id);
            await dispatch(fetch_orders({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    // <Popconfirm
    //     title={`Bạn có chắc muốn xóa đơn hàng ID [${text}]`}
    //     onConfirm={() => { onDelete(text) }}
    //     okText="Yes"
    //     cancelText="No">
    //     {/* <Button style={{ marginLeft: 5 }} icon={<EyeOutlined />}></Button> */}
    // <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
    // </Popconfirm>

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
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Thành tiền',
            dataIndex: 'GIA',
            render: (text) => numberWithCommas(text)
        },
    ];

    const handleChange = async (value, MA_DH) => {
        try {
            const { message } = await donhangApi.update(MA_DH, { action: value === 2 ? 'received' : value === 3 ? 'cancle' : '' });
            await dispatch(fetch_orders({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error })
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='orders box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {orders?.length < pagination?._limit ? orders.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Collapse>
                            {
                                orders?.map((order, idx) =>
                                    <Collapse.Panel header={`Đơn hàng: ${order.MA_DH}`} key={order.MA_DH}
                                        extra={<Tag icon={order.TRANG_THAI === 0 && <SyncOutlined spin />} color={getStatusOrderColor(order.TRANG_THAI)}>
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
                                                                <span className='category-label-key'>Email</span><span className='category-label-value'>{order.EMAIL_NGUOI_DAT}</span>
                                                            </div>

                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{order.MA_UU_DAI || 'Không áp dụng'}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Giảm giá </span><span className='category-label-value'>{numberWithCommas(order.GIAM_GIA)}&nbsp;₫</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Phí ship </span><span className='category-label-value'>{numberWithCommas(order.PHI_SHIP)}&nbsp;₫</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Trạng thái đơn hàng </span><span className='category-label-value'>
                                                                    <Select
                                                                        defaultValue={order.TRANG_THAI}
                                                                        style={{
                                                                            width: 120,
                                                                        }}
                                                                        options={[{ label: 'Đang giao', value: 1, disabled: true }, { label: 'Đã giao', value: 2 }, { label: 'Đã hủy', value: 3 }]}
                                                                        onChange={(value) => handleChange(value, order.MA_DH)}
                                                                    >

                                                                    </Select>
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={10}>
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
                                                                <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>{moment(order.NGAY_DAT_HANG).format('DD-MM-YYYY HH:mm:ss')}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Ngày giao hàng {order.TRANG_THAI == 1 ? '(dự kiến)' : ''}</span><span className='category-label-value'>{moment(order.TG_GIAO_HANG).format('DD-MM-YYYY')}</span>
                                                            </div>
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>Ghi chú</span><span className='category-label-value'>{order.GHI_CHU}</span>
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
                                                    columns={columnsExtend}
                                                    dataSource={order.SAN_PHAM}>
                                                </Table>
                                            </div>
                                            <div className='order-confirm__item__footer'>
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
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'orders', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default Order;

