import React from 'react';

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Skeleton, Table, Tag } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { getStatusOrder, numberWithCommas } from 'assets/admin';
import { fetch_orders, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { danhmucApi } from 'api/danhmucApi';
import moment from 'moment';
import { donhangApi } from 'api/donhangApi';
import './Order.scss';

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

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'MA_DH'
        },
        // {
        //     title: 'Mã nhân viên',
        //     dataIndex: 'NV_ID',
        // },
        {
            title: 'Nhân viên xác nhận',
            dataIndex: 'HO_TEN'
        },
        {
            title: 'Họ tên người đặt',
            dataIndex: 'HO_TEN',
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'TG_DAT_HANG',
            render: (text) => <div style={{ width: 150 }}>{moment(text).format('DD-MM-YYYY HH:mm:ss')}</div>
        },
        {
            title: 'Thời gian giao hàng',
            dataIndex: 'TG_GIAO_HANG',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'DIA_CHI',
            render: (text) => <div style={{ width: 150 }}>{text}</div>
        },

        {
            title: 'Hình thức thanh toán',
            dataIndex: 'HINH_THUC_THANH_TOAN',
            render: (text) => <div style={{ width: 200 }}>{text}</div>

        },
        {
            title: 'Phí ship',
            dataIndex: 'PHI_SHIP',
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Ghi chú',
            dataIndex: 'GHI_CHU',
            render: (text) => <div style={{ width: 150 }}>{text}</div>
        },
        {
            title: 'Giảm giá',
            dataIndex: 'GIAM_GIA'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'TONG_TIEN',
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'TRANG_THAI',
            render: (text) => <div style={{ width: 150 }}><Tag color={text == 0 ? 'warning' : text == 1 ? 'processing' : text == 2 ? 'success' : text == 3 ? 'error' : 'default'}>{getStatusOrder(text)}</Tag></div>
        },
        {
            title: 'Thanh toán',
            dataIndex: 'DA_THANH_TOAN',
            render: (text) => <div style={{ width: 150 }}>{<Tag color={text == '0' ? 'red' : 'green'}>{text == '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Tag>}</div>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'NGAY_TAO',
            render: (text) => <div style={{ width: 150 }}>{moment(text).format('DD-MM-YYYY HH:mm:ss')}</div>
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_PHIEU_NHAP',
            // fixed: 'right',
            // key: 'operation',
            render: (text, record) => <>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa đơn hàng ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No">
                    {/* <Button style={{ marginLeft: 5 }} icon={<EyeOutlined />}></Button> */}
                    <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];

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

    return (
        <div className='orders box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {orders?.length < pagination?._limit ? orders.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={orders}
                            pagination={
                                {
                                    current: pagination._page,
                                    total: pagination._totalPage,
                                    onChange: (page) => dispatch(savePagination({ screen: 'orders', page }))
                                }
                            }
                            expandable={{
                                expandedRowRender: (record) => (
                                    <Table
                                        className='table-detail'
                                        pagination={false}
                                        size='small'
                                        columns={columnsExtend}
                                        dataSource={record.SAN_PHAM}>
                                    </Table>
                                ),
                            }}
                        />
                    </>

            }
        </div>
    );
}

export default Order;

