import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Pagination, Popconfirm, Table, Tag } from 'antd';
import { nhanvienApi } from 'api/nhanvienApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_employees, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

Employee.propTypes = {

};

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

function Employee(props) {

    const {
        loading: { employees: isLoading },
        data: { employees },
        pagination: { employees: pagination } } = useSelector(state => state.adminInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(prepareDataEdit({ screen: 'employees', mode: "ADD" }))
    }, [pagination._limit, pagination._page]);


    const onEdit = (data) => {
        const DIA_CHI = data.DIA_CHI ? data.DIA_CHI.split(', ') : ['', '', ''];
        const [WARDS, DISTRICT, PROVINCES] = DIA_CHI;
        const newData = { ...data, PROVINCES, DISTRICT, WARDS }
        dispatch(prepareDataEdit({ screen: 'employees', mode: 'EDIT', data: newData }));
        navigate('/admin/employees/edit');
    }

    const onDelete = async (id) => {
        try {
            const { message } = await nhanvienApi.delete(id);
            await dispatch(fetch_employees({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    const onHandleUser = async (id, isBlock) => {
        try {
            await nhanvienApi.update(id, { BI_KHOA: isBlock ? '1' : '0', TRANG_THAI: isBlock ? 'Bị khóa' : 'Đang hoạt động' });
            await dispatch(fetch_employees({ _limit: pagination._limit, _page: pagination._page }));
            toast.success(`${isBlock ? 'Khóa' : 'Mở khóa'} tài khoản [${id}] thành công.`);
        } catch (error) {
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'NV_ID'
        },
        {
            title: 'Avatar',
            dataIndex: 'ANH_DAI_DIEN',
            render: (text, record) => text ? <Avatar src={text} size="large"></Avatar> : <Avatar style={{ backgroundColor: colorList[Math.ceil(Math.random() * colorList.length) % colorList.length], verticalAlign: 'middle' }} size="large">{record?.HO_TEN?.charAt(0).toUpperCase() || '-'}</Avatar>
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
            title: 'Email',
            dataIndex: 'EMAIL',
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'DIA_CHI',
            render: (text) => <div style={{ width: 200 }}>{text}</div>
        },
        {
            title: 'Giới tính',
            dataIndex: 'GIOI_TINH',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'TEN_CV',
        },
        {
            title: 'Lương',
            dataIndex: 'LUONG_CO_BAN',
            render: (text) => numberWithCommas(text)
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'NGAY_TAO',
        //     render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'TRANG_THAI',
            render: (text, record) => <Tag color={record.BI_KHOA === "1" ? "red" : "green"}>{text}</Tag>
        },
        // {
        //     title: 'Cập nhật',
        //     dataIndex: 'CAP_NHAT',
        //     render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss')
        // },
        {
            title: 'Hành động',
            dataIndex: 'NV_ID',
            render: (text, record) => <div style={{ width: 120 }}> <Button onClick={() => { onEdit(record); }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    placement='left'
                    title={`Bạn có chắc muốn ${record.BI_KHOA === "0" ? 'khóa' : 'mở khóa'} tài khoản [${text}] ?`}
                    onConfirm={() => { onHandleUser(text, record.BI_KHOA === '0') }}
                    okText="Yes"
                    cancelText="No">
                    <Button style={{ marginLeft: 5 }} icon={record.BI_KHOA === "0" ? <LockOutlined /> : <UnlockOutlined />}></Button>
                </Popconfirm>
                <Popconfirm
                    placement='left'
                    title={`Bạn có chắc muốn xóa nhân viên ID [${text}] ?`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No">
                    <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </div>
        },
    ];

    return (
        <div className='employees box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <>
                        <p>Tổng số: {employees?.length < pagination?._limit ? employees.length : pagination._limit}/ {pagination._totalRecord} bản ghi</p>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={employees}
                            pagination={false}
                        />
                        <Divider />
                        <Pagination
                            pageSize={1}
                            current={pagination._page}
                            total={pagination._totalPage}
                            onChange={(page) => dispatch(savePagination({ screen: 'employees', page }))} ></Pagination>
                    </>

            }
        </div>
    );
}

export default Employee;

