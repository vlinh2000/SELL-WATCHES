import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Skeleton, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_categories, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { danhmucApi } from 'api/danhmucApi';

Category.propTypes = {

};


function Category(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { categories: isLoading },
        data: { categories },
        pagination: { categories: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'categories', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'categories', mode: 'EDIT', data }));
        navigate('/admin/categories/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await danhmucApi.delete(id);
            await dispatch(fetch_categories({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã danh mục',
            dataIndex: 'MA_DANH_MUC'
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'TEN_DANH_MUC',
        },
        {
            title: 'Mã loại sản phẩm',
            dataIndex: 'MA_LOAI_SP'
        },
        {
            title: 'Tên loại sản phẩm',
            dataIndex: 'TEN_LOAI_SP'
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_DANH_MUC',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa danh mục ID [${text}]`}
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
        <div className='categories box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {categories?.length < pagination?._limit ? categories.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={categories}
                            pagination={
                                {
                                    current: pagination._page,
                                    total: pagination._totalPage,
                                    onChange: (page) => dispatch(savePagination({ screen: 'categories', page }))
                                }
                            }
                        />
                    </>

            }
        </div>
    );
}

export default Category;

