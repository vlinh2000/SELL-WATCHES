import React from 'react';

import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Pagination, Popconfirm, Table, Tag } from 'antd';
import { nguoidungApi } from 'api/nguoidungApi';
import { fetch_users, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

User.propTypes = {

};

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

function User(props) {

    const {
        loading: { users: isLoading },
        data: { users },
        pagination: { users: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'users', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    // const onEdit = (data) => {
    //     dispatch(prepareDataEdit({ screen: 'users', mode: 'EDIT', data }));
    //     navigate('/admin/users/edit');
    // }

    const onDelete = async (id) => {
        try {
            const { message } = await nguoidungApi.delete(id);
            await dispatch(fetch_users({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const onHandleUser = async (id, isBlock) => {
        try {
            await nguoidungApi.update(id, { BI_KHOA: isBlock ? '1' : '0', TRANG_THAI: isBlock ? 'Bị khóa' : 'Đang hoạt động' });
            await dispatch(fetch_users({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(`${isBlock ? 'Khóa' : 'Mở khóa'} tài khoản [${id}] thành công.`);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'USER_ID'
        },
        {
            title: 'Avatar',
            dataIndex: 'ANH_DAI_DIEN',
            render: (text) => text ? <Avatar src={text} ></Avatar> : <Avatar style={{ backgroundColor: colorList[Math.ceil(Math.random() * colorList.length) % colorList.length], verticalAlign: 'middle' }}>{text || '-'}</Avatar>
        },
        {
            title: 'Họ tên',
            dataIndex: 'HO_TEN'
        },
        {
            title: 'SĐT',
            dataIndex: 'SO_DIEN_THOAI',
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'DIA_CHI',
        },
        {
            title: 'Giới tính',
            dataIndex: 'GIOI_TINH',
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'LOAI_TAI_KHOAN',
        },
        {
            title: 'Email',
            dataIndex: 'EMAIL'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'TRANG_THAI',
            render: (text, record) => <Tag color={record.BI_KHOA === "1" ? "red" : "green"}>{text}</Tag>
            // render: (text) => numberWithCommas(text)
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'NGAY_TAO',
        //     render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        // },
        // {
        //     title: 'Cập nhật',
        //     dataIndex: 'CAP_NHAT',
        //     render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        // },
        {
            title: 'Hành động',
            dataIndex: 'USER_ID',
            render: (text, record) => <>
                <Popconfirm
                    title={`Bạn có chắc muốn ${record.BI_KHOA === "0" ? 'khóa' : 'mở khóa'} tài khoản [${text}]`}
                    onConfirm={() => { onHandleUser(text, record.BI_KHOA === '0') }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={record.BI_KHOA === "0" ? <LockOutlined /> : <UnlockOutlined />}></Button>
                </Popconfirm>

                <Popconfirm
                    title={`Bạn có chắc muốn xóa user ID [${text}]`}
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
        <div className='users box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {users?.length < pagination?._limit ? users.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={users}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'users', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default User;

