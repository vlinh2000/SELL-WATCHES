import { Menu } from 'antd';
import './SideBar.scss';

import {
    AppstoreAddOutlined,
    BarcodeOutlined,
    BarsOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ClusterOutlined, CodeOutlined, DashboardOutlined, FieldTimeOutlined,
    GroupOutlined,
    InfoCircleOutlined,
    LogoutOutlined, MenuOutlined, NodeExpandOutlined, OrderedListOutlined, UsergroupAddOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'app/authSlice';

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

function SideBar(props) {

    const dispatch = useDispatch();

    const items = [
        getItem('Dashboard', '1', <Link to="/admin/dashboard"><DashboardOutlined /></Link>),
        getItem('Quản lý nhân viên', '2', <UsergroupAddOutlined />, [
            getItem('Cập nhật nhân viên', '221', <Link to="/admin/employees/edit"></Link>),
            getItem('Danh sách nhân viên', '222', <Link to="/admin/employees/view"></Link>),
        ]),
        getItem('Quản lý đơn hàng', '3', <GroupOutlined />, [
            getItem('Xác nhận đơn hàng', '331', <Link to="/admin/orders/confirm"></Link>),
            // getItem('Cập nhật đơn hàng', '332', <Link to="/admin/orders/edit"></Link>),
            getItem('Danh sách đơn hàng', '333', <Link to="/admin/orders/view"></Link>),
        ]),
        getItem('Quản lý sản phẩm', '4', <ClockCircleOutlined />, [
            getItem('Cập nhật sản phẩm', '441', <Link to="/admin/products/edit"></Link>),
            getItem('Danh sách sản phẩm', '442', <Link to="/admin/products/view"></Link>),
        ]),
        getItem('Quản lý loại sản phẩm', '9', <FieldTimeOutlined />, [
            getItem('Cập nhật loại sản phẩm', '991', <Link to="/admin/productTypes/edit"></Link>),
            getItem('Danh sách loại sản phẩm', '992', <Link to="/admin/productTypes/view"></Link>),
        ]),
        getItem('Quản lý chức vụ', '5', <OrderedListOutlined />, [
            getItem('Cập nhật chức vụ', '551', <Link to="/admin/positions/edit"></Link>),
            getItem('Danh sách chức vụ', '552', <Link to="/admin/positions/view"></Link>),
        ]),
        getItem('Quản lý phiếu nhập kho', '6', <InfoCircleOutlined />, [
            getItem('Cập nhật phiếu nhập kho', '661', <Link to="/admin/receipts/edit"></Link>),
            getItem('Danh sách phiếu nhập kho', '662', <Link to="/admin/receipts/view"></Link>),
        ]),
        getItem('Quản lý ưu đãi', '7', <ClusterOutlined />, [
            getItem('Cập nhật ưu đãi', '771', <Link to="/admin/vouchers/edit"></Link>),
            getItem('Danh sách ưu đãi', '772', <Link to="/admin/vouchers/view"></Link>),
        ]),
        getItem('Quản lý thương hiệu', '8', <VideoCameraOutlined />, [
            getItem('Cập nhật thương hiệu', '881', <Link to="/admin/brands/edit"></Link>),
            getItem('Danh sách thương hiệu', '882', <Link to="/admin/brands/view"></Link>),
        ]),
        getItem('Quản lý người dùng', '10', <UserOutlined />, [
            getItem('Danh sách người dùng', '10101', <Link to="/admin/users/view"></Link>),
        ]),
        getItem('Quản lý nhà cung cấp', '11', <AppstoreAddOutlined />, [
            getItem('Cập nhật nhà cung cấp', '11111', <Link to="/admin/suppliers/edit"></Link>),
            getItem('Danh sách nhà cung cấp', '11112', <Link to="/admin/suppliers/view"></Link>),
        ]),
        getItem('Quản lý sự kiện', '12', <NodeExpandOutlined />, [
            getItem('Cập nhật sự kiện', '12121', <Link to="/admin/events/edit"></Link>),
            getItem('Danh sách sự kiện', '12122', <Link to="/admin/events/view"></Link>),
        ]),
        // getItem('Quản lý sự kiện', '13', <BarcodeOutlined />, [
        //     getItem('Cập nhật phiếu giảm giá', '13131', <Link to="/admin/vouchers/edit"></Link>),
        //     getItem('Danh sách phiếu giảm giá', '13132', <Link to="/admin/vouchers/view"></Link>),
        // ]),
    ];

    const { selectedKey } = useSelector(state => state.adminInfo);

    return (
        <div className='sidebar'>
            <div className="logo">
                <Link to="/">
                    <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='img' />
                </Link>
            </div>
            <Menu
                style={{ marginTop: '-4px' }}
                // openKeys={}
                // onClick={({ item, key, keyPath, domEvent }) => console.log(key)}
                selectedKeys={[selectedKey]}
                defaultOpenKeys={[selectedKey?.charAt(0)]}
                mode="inline"
                // inlineCollapsed={true}
                theme='dark'
                items={items}
            />
            <p className="btn-logout" onClick={() => dispatch(logout())}><LogoutOutlined />&nbsp; &nbsp;Đăng xuất </p>
        </div>
    );
}

export default SideBar;