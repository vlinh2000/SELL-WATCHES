import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Pagination, Popconfirm, Table } from 'antd';
import { nhacungcapApi } from 'api/nhacungcapApi';
import { fetch_suppliers, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

Supplier.propTypes = {

};


function Supplier(props) {

    // const [pagination, setPagination] = React.useState({ _limit: 10, _page: 1, _totalPage: 1 });
    const {
        loading: { suppliers: isLoading },
        data: { suppliers },
        pagination: { suppliers: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'suppliers', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        const DIA_CHI = data.DIA_CHI.split(', ');
        const [WARDS, DISTRICT, PROVINCES] = DIA_CHI;
        const newData = { MA_NCC: data.MA_NCC, TEN_NCC: data.TEN_NCC, SO_DIEN_THOAI: data.SO_DIEN_THOAI, PROVINCES, DISTRICT, WARDS }
        dispatch(prepareDataEdit({ screen: 'suppliers', mode: 'EDIT', data: newData }));
        navigate('/admin/suppliers/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await nhacungcapApi.delete(id);
            await dispatch(fetch_suppliers({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'Mã nhà cung cấp',
            dataIndex: 'MA_NCC'
        },
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'TEN_NCC',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'DIA_CHI'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'SO_DIEN_THOAI'
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_NCC',
            render: (text, record) => <> <Button shape="circle" onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa nhà cung cấp ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button shape="circle" style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];

    return (
        <div className='suppliers box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {suppliers?.length < pagination?._limit ? suppliers.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={suppliers}
                            pagination={false}
                        />
                    </>

            }
            <Pagination
                pageSize={1}
                current={pagination._page}
                total={pagination._totalPage}
                onChange={(page) => dispatch(savePagination({ screen: 'suppliers', page }))} ></Pagination>
        </div>
    );
}

export default Supplier;

