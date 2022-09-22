import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Pagination, Popconfirm, Table } from 'antd';
import { sanphamApi } from 'api/sanphamApi';
import { fetch_products, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Product.scss';
import { numberWithCommas } from 'assets/admin';
Product.propTypes = {

};


function Product(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { products: isLoading },
        data: { products },
        pagination: { products: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'products', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        dispatch(prepareDataEdit({ screen: 'products', mode: 'EDIT', data }));
        navigate('/admin/products/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await sanphamApi.delete(id);
            await dispatch(fetch_products({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'HINH_ANH',
            render: (anhsanphams) => <img className='product-image' src={anhsanphams} alt="anhsanpham" />
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'TEN_SP',
            render: (text) => <div style={{ width: 200 }}>{text}</div>
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'TEN_LOAI_SP'
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'TEN_THUONG_HIEU',
        },

        {
            title: 'Giá gốc',
            dataIndex: 'GIA_GOC',
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Giá bán',
            dataIndex: 'GIA_BAN',
            render: (text) => numberWithCommas(text)
        },
        {
            title: 'Số lượng kho',
            dataIndex: 'SO_LUONG'
        },
        {
            title: 'Mô tả',
            dataIndex: 'MO_TA',
            render: (text) => <div style={{ width: 300 }}>{text}</div>
        },
        {
            title: 'Chất liệu dây',
            dataIndex: 'CHAT_LIEU_DAY'
        },
        {
            title: 'Chất liệu mặt kính',
            dataIndex: 'CHAT_LIEU_MAT_KINH'
        },
        {
            title: 'Pin',
            dataIndex: 'PIN'
        },
        {
            title: 'Mức chống nước',
            dataIndex: 'MUC_CHONG_NUOC'
        },
        {
            title: 'Hình dạng mặt số',
            dataIndex: 'HINH_DANG_MAT_SO'
        },
        {
            title: 'Kích thướt mặt số',
            dataIndex: 'KICH_THUOC_MAT_SO'
        },
        {
            title: 'Màu mặt số',
            dataIndex: 'MAU_MAT_SO'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'TRANG_THAI'
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_SP',
            render: (text, record) => <> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa sản phẩm ID [${text}]`}
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
        <div className='products box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {products?.length < pagination?._limit ? products.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={products}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination?._page}
                            total={pagination?._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'products', page }))} ></Pagination>

                    </>

            }
        </div>
    );
}

export default Product;

