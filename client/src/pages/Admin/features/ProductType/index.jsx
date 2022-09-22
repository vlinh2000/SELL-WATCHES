import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Pagination, Popconfirm, Row, Skeleton, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_productTypes, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { loaisanphamApi } from 'api/loaisanphamApi';

ProductType.propTypes = {

};


function ProductType(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { productTypes: isLoading },
        data: { productTypes },
        pagination: { productTypes: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'productTypes', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'productTypes', mode: 'EDIT', data }));
        navigate('/admin/productTypes/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await loaisanphamApi.delete(id);
            await dispatch(fetch_productTypes({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã loại sản phẩm',
            dataIndex: 'MA_LOAI_SP'
        },
        {
            title: 'Tên loại sản phẩm',
            dataIndex: 'TEN_LOAI_SP',
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_LOAI_SP',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa loại sản phẩm ID [${text}]`}
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
        <div className='productTypes box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {productTypes?.length < pagination?._limit ? productTypes.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={productTypes}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'productTypes', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default ProductType;

