import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Pagination, Popconfirm, Row, Skeleton, Table, Tag } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_events, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { sukienApi } from 'api/sukienApi';
import moment from 'moment';

Event.propTypes = {

};


function Event(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { events: isLoading },
        data: { events },
        pagination: { events: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'events', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'events', mode: 'EDIT', data }));
        navigate('/admin/events/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await sukienApi.delete(id);
            await dispatch(fetch_events({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }
    const columns = [
        {
            title: 'Mã sự kiện',
            dataIndex: 'MA_SK'
        },
        {
            title: 'Tên sự kiện',
            dataIndex: 'TEN_SK',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'TG_BAT_DAU',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'TG_KET_THUC',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Khung giờ từ',
            dataIndex: 'KHUNG_GIO_TU',
        },
        {
            title: 'Khung giờ đến',
            dataIndex: 'KHUNG_GIO_DEN',
        },
        {
            title: 'DS mã ưu đãi',
            dataIndex: 'VOUCHERS',
            render: (text) => text?.map(voucher => <Tag color='#55acee' key={voucher.MA_UU_DAI}>{voucher.MA_UU_DAI}</Tag>)
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_SK',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa sự kiện ID [${text}]`}
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
        <div className='events box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {events?.length < pagination?._limit ? events.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={events}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'events', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default Event;

