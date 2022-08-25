import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Popconfirm, Radio, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

Employee.propTypes = {

};

function Employee(props) {

    const onEdit = (id) => {
        alert(id)
    }

    const onDelete = (id) => {
        alert(id)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (text) => <img style={{ objectFit: 'contain' }} width={50} height={50} src={text} />
        },
        {
            title: 'Họ tên',
            dataIndex: 'name'
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'userName',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
        },
        {
            title: 'Lương',
            dataIndex: 'money',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createAt',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'updateAt',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            render: (text) => <> <Button onClick={() => { onEdit(text) }} icon={<EditOutlined />}></Button>
                <Popconfirm
                    title={`Bạn có chắc muốn xóa nhân viên ID [${text}]`}
                    onConfirm={() => { onDelete(text) }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];
    const data = [
        {
            key: '1',
            id: '#1',
            name: 'Việt linh',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg',
            address: 'Xuân Hòa, Kế Sách, Sóc Trăng',
            gender: 'nam',
            userName: 'linh_vip2000',
            email: 'linh@gmail.com',
            phone: '0387746557',
            position: 'Bảo vệ',
            money: 90432423,
            createAt: '2022-8-19 11:11:00',
            updateAt: '2022-8-19 12:00:00',
        },
        {
            key: '2',
            id: '#2',
            name: 'Việt linh',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg',
            address: 'Xuân Hòa, Kế Sách, Sóc Trăng',
            gender: 'nam',
            userName: 'linh_vip2000',
            email: 'linh@gmail.com',
            phone: '0387746557',
            position: 'Bảo vệ',
            money: 90432423,
            createAt: '2022-8-19 11:11:00',
            updateAt: '2022-8-19 12:00:00',
        },
        {
            key: '3',
            id: '#3',
            name: 'Việt linh',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg',
            address: 'Xuân Hòa, Kế Sách, Sóc Trăng',
            gender: 'nam',
            userName: 'linh_vip2000',
            email: 'linh@gmail.com',
            phone: '0387746557',
            position: 'Bảo vệ',
            money: 90432423,
            createAt: '2022-8-19 11:11:00',
            updateAt: '2022-8-19 12:00:00',
        }
    ];


    return (
        <div className='employees box'>
            <Table
                size='small'
                columns={columns}
                dataSource={data}
            />
        </div>
    );
}

export default Employee;

