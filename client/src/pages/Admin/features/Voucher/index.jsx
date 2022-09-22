import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Pagination, Popconfirm, Row, Skeleton, Table, Tag } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_vouchers, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { uudaiApi } from 'api/uudaiApi';
import moment from 'moment';

Voucher.propTypes = {

};


function Voucher(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { vouchers: isLoading },
        data: { vouchers },
        pagination: { vouchers: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'vouchers', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'vouchers', mode: 'EDIT', data }));
        navigate('/admin/vouchers/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await uudaiApi.delete(id);
            await dispatch(fetch_vouchers({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã ưu đãi',
            dataIndex: 'MA_UU_DAI'
        },
        {
            title: 'Tên ưu đãi',
            dataIndex: 'TEN_UU_DAI',
        },
        {
            title: 'Số lượng',
            dataIndex: 'SO_LUONG_BAN_DAU',
        },
        {
            title: 'Số lượng còn lại',
            dataIndex: 'SO_LUONG_CON_LAI',
        },
        {
            title: 'Hạn sử dụng',
            dataIndex: 'HSD',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Loại ưu đãi',
            dataIndex: 'MPVC',
            render: (text) => text === 1 ? <Tag>Miễn phí vận chuyển</Tag> : <Tag>Giảm giá đơn hàng</Tag>
        },
        {
            title: 'Giá trị',
            dataIndex: 'GIA_TRI',
            render: (text, record) => record.MPVC === 1 ? <Tag color="#3b5999">100%</Tag> : <Tag color="#3b5999">{numberWithCommas(text) + record.DON_VI_GIAM}</Tag>
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_UU_DAI',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa voucher ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];


    return (
        <div className='vouchers box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {vouchers?.length < pagination?._limit ? vouchers.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={vouchers}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'vouchers', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default Voucher;

