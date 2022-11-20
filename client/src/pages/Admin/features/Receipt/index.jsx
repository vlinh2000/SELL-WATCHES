import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Pagination, Popconfirm, Table } from 'antd';
import { phieunhapApi } from 'api/phieunhapApi';
import { numberWithCommas } from 'assets/admin';
import moment from 'moment';
import { fetch_receipts, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

Receipt.propTypes = {

};


function Receipt(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { receipts: isLoading },
        data: { receipts },
        pagination: { receipts: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'receipts', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'receipts', mode: 'EDIT', data }));
        navigate('/admin/receipts/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await phieunhapApi.delete(id);
            await dispatch(fetch_receipts({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã phiếu nhập',
            dataIndex: 'MA_PHIEU_NHAP'
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'NV_ID',
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'HO_TEN'
        },
        {
            title: 'Mã nhà cung cấp',
            dataIndex: 'MA_NCC'
        },

        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'TEN_NCC'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'TONG_TIEN',
            render: (text) => numberWithCommas(text) + '₫'
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'NGAY_TAO',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_PHIEU_NHAP',
            render: (text, record) => <> <Button shape='circle' onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa phiếu nhập ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No"
                >
                    {/* <Button style={{ marginLeft: 5 }} icon={<EyeOutlined />}></Button> */}
                    <Button style={{ marginLeft: 5 }} shape='circle' danger icon={<DeleteOutlined />}></Button>
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
            render: (text) => numberWithCommas(text) + '₫'
        },
        {
            title: 'Thành tiền',
            dataIndex: 'GIA',
            render: (text) => numberWithCommas(text) + '₫'
        },
    ];

    return (
        <div className='receipts box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {receipts?.length < pagination?._limit ? receipts.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={receipts}
                            pagination={false}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <>
                                        <Table
                                            className='table-detail'
                                            pagination={false}
                                            size='small'
                                            columns={columnsExtend}
                                            dataSource={record.SAN_PHAM}>
                                        </Table>
                                        <p style={{ textAlign: 'left;' }}><i>Ghi chú:</i> {record.GHI_CHU || 'không'}</p>
                                        <Divider />
                                    </>
                                ),
                            }}
                        />

                    </>

            }
            <Pagination
                pageSize={1}
                current={pagination._page}
                total={pagination._totalPage}
                onChange={(page) => dispatch(savePagination({ screen: 'receipts', page }))} ></Pagination>
        </div>
    );
}

export default Receipt;

