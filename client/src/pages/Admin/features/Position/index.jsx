import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Pagination, Popconfirm, Row, Skeleton, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_positions, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';

Positon.propTypes = {

};


function Positon(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { positions: isLoading },
        data: { positions },
        pagination: { positions: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'positions', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'positions', mode: 'EDIT', data }));
        navigate('/admin/positions/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await chucvuApi.delete(id);
            await dispatch(fetch_positions({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã chức vụ',
            dataIndex: 'MA_CV'
        },
        {
            title: 'Tên chức vụ',
            dataIndex: 'TEN_CV',
        },
        {
            title: 'Lương',
            dataIndex: 'LUONG_CO_BAN',
            render: (text) => numberWithCommas(text) + ' ₫'
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_CV',
            render: (text, record) => <> <Button shape='circle' onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa chức vụ ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button shape='circle' style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];


    return (
        <div className='positions box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {positions?.length < pagination?._limit ? positions.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={positions}
                            pagination={false}
                        />
                    </>

            }
            <Pagination
                pageSize={1}
                current={pagination._page}
                total={pagination._totalPage}
                onChange={(page) => dispatch(savePagination({ screen: 'positions', page }))} ></Pagination>
        </div>
    );
}

export default Positon;

