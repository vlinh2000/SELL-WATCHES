import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Skeleton, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_rules, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { danhmucApi } from 'api/danhmucApi';
import { quyenApi } from 'api/quyenApi';

Rule.propTypes = {

};


function Rule(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { rules: isLoading },
        data: { rules },
        pagination: { rules: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'rules', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'rules', mode: 'EDIT', data }));
        navigate('/admin/rules/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await quyenApi.delete(id);
            await dispatch(fetch_rules({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã quyền',
            dataIndex: 'MA_QUYEN'
        },
        {
            title: 'Tên quyền',
            dataIndex: 'TEN_QUYEN',
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_QUYEN',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa quyền ID [${text}]`}
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
        <div className='rules box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {rules?.length < pagination?._limit ? rules.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={rules}
                            pagination={
                                {
                                    current: pagination._page,
                                    total: pagination._totalPage,
                                    onChange: (page) => dispatch(savePagination({ screen: 'rules', page }))
                                }
                            }
                        />
                    </>

            }
        </div>
    );
}

export default Rule;

