import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Skeleton, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_brands, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { danhmucApi } from 'api/danhmucApi';
import { thuonghieuApi } from 'api/thuonghieuApi';

Brand.propTypes = {

};


function Brand(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { brands: isLoading },
        data: { brands },
        pagination: { brands: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'brands', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'brands', mode: 'EDIT', data }));
        navigate('/admin/brands/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await thuonghieuApi.delete(id);
            await dispatch(fetch_brands({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã thương hiệu',
            dataIndex: 'MA_THUONG_HIEU'
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'TEN_THUONG_HIEU',
        },
        {
            title: 'Quốc gia',
            dataIndex: 'QUOC_GIA',
        },
        {
            title: 'Năm thành lập',
            dataIndex: 'NAM_THANH_LAP',
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_THUONG_HIEU',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa thương hiệu ID [${text}]`}
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
        <div className='brands box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {brands?.length < pagination?._limit ? brands.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={brands}
                            pagination={
                                {
                                    current: pagination._page,
                                    total: pagination._totalPage,
                                    onChange: (page) => dispatch(savePagination({ screen: 'brands', page }))
                                }
                            }
                        />
                    </>

            }
        </div>
    );
}

export default Brand;

