import { Menu } from 'antd';
import './SideBar.scss';

import {
    ClockCircleOutlined,
    ClusterOutlined, DashboardOutlined, FieldTimeOutlined,
    GroupOutlined,
    InfoCircleOutlined,
    LogoutOutlined, OrderedListOutlined, UsergroupAddOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

SideBar.propTypes = {

};

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('Dashboard', '1', <Link to="/admin/dashboard"><DashboardOutlined /></Link>),
    getItem('Quản lý nhân viên', '2', <UsergroupAddOutlined />, [
        getItem('Cập nhật nhân viên', '221', <Link to="/admin/employees/edit"></Link>),
        getItem('Danh sách nhân viên', '222', <Link to="/admin/employees/view"></Link>),
    ]),
    getItem('Quản lý đơn hàng', '3', <GroupOutlined />, [
        getItem('Xác nhận đơn hàng', '331', <Link to="/admin/orders/comfirm"></Link>),
        getItem('Cập nhật đơn hàng', '332', <Link to="/admin/orders/edit"></Link>),
        getItem('Danh sách đơn hàng', '333', <Link to="/admin/orders/view"></Link>),
    ]),
    getItem('Quản lý sản phẩm', '4', <ClockCircleOutlined />, [
        getItem('Cập nhật sản phẩm', '441', <Link to="/admin/products/edit"></Link>),
        getItem('Danh sách sản phẩm', '442', <Link to="/admin/products/view"></Link>),
    ]),
    getItem('Quản lý loại sản phẩm', '9', <FieldTimeOutlined />, [
        getItem('Cập nhật sản phẩm', '991', <Link to="/admin/products/edit"></Link>),
        getItem('Danh sách sản phẩm', '992', <Link to="/admin/products/view"></Link>),
    ]),
    getItem('Quản lý chức vụ', '5', <OrderedListOutlined />, [
        getItem('Cập nhật chức vụ', '551', <Link to="/admin/positions/edit"></Link>),
        getItem('Danh sách chức vụ', '552', <Link to="/admin/positions/view"></Link>),
    ]),
    getItem('Quản lý phiếu nhập kho', '6', <InfoCircleOutlined />, [
        getItem('Cập nhật phiếu nhập kho', '661', <Link to="/admin/receipts/edit"></Link>),
        getItem('Danh sách phiếu nhập kho', '662', <Link to="/admin/receipts/view"></Link>),
    ]),
    getItem('Quản lý danh mục', '7', <ClusterOutlined />, [
        getItem('Cập nhật danh mục', '771', <Link to="/admin/categories/edit"></Link>),
        getItem('Danh sách danh mục', '772', <Link to="/admin/categories/view"></Link>),
    ]),
    getItem('Quản lý thương hiệu', '8', <VideoCameraOutlined />, [
        getItem('Cập nhật thương hiệu', '881', <Link to="/admin/brands/edit"></Link>),
        getItem('Danh sách thương hiệu', '882', <Link to="/admin/brands/view"></Link>),
    ]),
    getItem('Quản lý người dùng', '10', <UserOutlined />, [
        getItem('Danh sách người dùng', '10101', <Link to="/admin/users/view"></Link>),
    ]),
    getItem('Đăng xuất', '4', <LogoutOutlined />),
];
function SideBar(props) {
    return (
        <div className='sidebar'>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                // inlineCollapsed={true}
                theme='dark'
                items={items}
            />
        </div>
    );
}

export default SideBar;