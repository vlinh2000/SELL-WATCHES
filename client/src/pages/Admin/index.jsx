import { CloseCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { toggleSideBar } from 'assets/admin';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { fetch_brands, fetch_employees, fetch_events, fetch_myRoles, fetch_orders, fetch_orders_pending, fetch_positions, fetch_products, fetch_productTypes, fetch_receipts, fetch_rules, fetch_statistical, fetch_suppliers, fetch_users, fetch_vouchers } from './adminSlice';
import BreadcrumbCustomv2 from './components/BreadcrumbCustomv2';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Brand from './features/Brand';
import BrandEdit from './features/Brand/sub-pages';
import Dashboard from './features/DashBoard';
import Employee from './features/Employee';
import EmployeeEdit from './features/Employee/sub-pages';
import Event from './features/Event';
import EventEdit from './features/Event/EventEdit';
import Order from './features/Order';
import OrderConfirm from './features/Order/sub-pages';
import Positon from './features/Position';
import PositionEdit from './features/Position/sub-pages';
import Product from './features/Product';
import ProductEdit from './features/Product/sub-pages';
import ProductType from './features/ProductType';
import ProductTypeEdit from './features/ProductType/sub-pages';
import Receipt from './features/Receipt';
import ReceiptEdit from './features/Receipt/sub-pages';
import RevenueReport from './features/Report/RevenueReport';
import Rule from './features/Rule';
import RuleEdit from './features/Rule/RuleEdit';
import RuleEmployeeEdit from './features/Rule/RuleEmployeeEdit';
import Supplier from './features/Supplier';
import SupplierEdit from './features/Supplier/sub-pages';
import User from './features/User';
import Voucher from './features/Voucher';
import VoucherEdit from './features/Voucher/VoucherEdit';
import VoucherGive from './features/Voucher/VoucherGive';

AdminPage.propTypes = {

};

function AdminPage(props) {

    const { pagination } = useSelector(state => state.adminInfo);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    React.useEffect(() => {
        user?.NV_ID && dispatch(fetch_myRoles());
    }, [user])

    React.useEffect(() => {
        dispatch(fetch_positions({ _limit: pagination.positions._limit, _page: pagination.positions._page }));
    }, [pagination.positions])

    React.useEffect(() => {
        dispatch(fetch_productTypes({ _limit: pagination.productTypes._limit, _page: pagination.productTypes._page }));
    }, [pagination.productTypes])

    React.useEffect(() => {
        dispatch(fetch_brands({ _limit: pagination.brands._limit, _page: pagination.brands._page }));
    }, [pagination.brands])

    React.useEffect(() => {
        dispatch(fetch_users({ _limit: pagination.users._limit, _page: pagination.users._page }));
    }, [pagination.users])

    React.useEffect(() => {
        dispatch(fetch_suppliers({ _limit: pagination.suppliers._limit, _page: pagination.suppliers._page }));
    }, [pagination.suppliers])

    React.useEffect(() => {
        dispatch(fetch_rules({ _limit: pagination.rules._limit, _page: pagination.rules._page }));
    }, [pagination.rules])

    React.useEffect(() => {
        dispatch(fetch_employees({ _limit: pagination.employees._limit, _page: pagination.employees._page }));
    }, [pagination.employees])

    React.useEffect(() => {
        dispatch(fetch_receipts({ _limit: pagination.receipts._limit, _page: pagination.receipts._page }));
    }, [pagination.receipts])

    React.useEffect(() => {
        dispatch(fetch_products({ _limit: pagination.products._limit, _page: pagination.products._page }));
    }, [pagination.products])

    React.useEffect(() => {
        dispatch(fetch_orders({ _limit: pagination.orders._limit, _page: pagination.orders._page, status: JSON.stringify('[1,2,3]') }));
    }, [pagination.orders])

    React.useEffect(() => {
        dispatch(fetch_vouchers({ _limit: pagination.vouchers._limit, _page: pagination.vouchers._page }));
    }, [pagination.vouchers])

    React.useEffect(() => {
        dispatch(fetch_events({ _limit: pagination.events._limit, _page: pagination.events._page }));
    }, [pagination.events])

    React.useEffect(() => {
        dispatch(fetch_statistical());
    }, [])

    React.useEffect(() => {
        dispatch(fetch_orders_pending({ _limit: pagination.ordersConfirm._limit, _page: pagination.ordersConfirm._page, status: JSON.stringify('[0]') }));
    }, [pagination.ordersConfirm])

    return (
        <div className='admin-page'>
            <Row>
                <Col xs={24} sm={24} md={8} lg={4}>
                    <SideBar />
                </Col>
                <Col xs={24} sm={24} md={16} lg={20}>
                    <Header />
                    <div className="main-wrapper">
                        <CloseCircleOutlined onClick={toggleSideBar} className='close-btn' />
                        <BreadcrumbCustomv2 />
                        <br />
                        <Routes>
                            <Route index path='dashboard' element={<Dashboard />}></Route>
                            <Route path='/' element={<Navigate to="dashboard" />}></Route>
                            <Route path='/employees'>
                                <Route path='view' element={<Employee />}></Route>
                                <Route path='edit' element={<EmployeeEdit />}></Route>
                            </Route>
                            <Route path='/positions'>
                                <Route path='view' element={<Positon />}></Route>
                                <Route path='edit' element={<PositionEdit />}></Route>
                            </Route>
                            <Route path='/productTypes'>
                                <Route path='view' element={<ProductType />}></Route>
                                <Route path='edit' element={<ProductTypeEdit />}></Route>
                            </Route>
                            <Route path='/events'>
                                <Route path='view' element={<Event />}></Route>
                                <Route path='edit' element={<EventEdit />}></Route>
                            </Route>
                            <Route path='/brands'>
                                <Route path='view' element={<Brand />}></Route>
                                <Route path='edit' element={<BrandEdit />}></Route>
                            </Route>
                            <Route path='/users'>
                                <Route path='view' element={<User />}></Route>
                                {/* <Route path='edit' element={<BrandEdit />}></Route> */}
                            </Route>
                            <Route path='/suppliers'>
                                <Route path='view' element={<Supplier />}></Route>
                                <Route path='edit' element={<SupplierEdit />}></Route>
                            </Route>
                            <Route path='/receipts'>
                                <Route path='view' element={<Receipt />}></Route>
                                <Route path='edit' element={<ReceiptEdit />}></Route>
                            </Route>
                            <Route path='/products'>
                                <Route path='view' element={<Product />}></Route>
                                <Route path='edit' element={<ProductEdit />}></Route>
                            </Route>
                            <Route path='/orders'>
                                <Route path='view' element={<Order />}></Route>
                                <Route path='confirm' element={<OrderConfirm />}></Route>
                            </Route>
                            <Route path='/vouchers'>
                                <Route path='view' element={<Voucher />}></Route>
                                <Route path='give' element={<VoucherGive />}></Route>
                                <Route path='edit' element={<VoucherEdit />}></Route>
                            </Route>
                            <Route path='/rules'>
                                <Route path='view' element={<Rule />}></Route>
                                <Route path='edit' element={<RuleEdit />}></Route>
                            </Route>
                            <Route path='/revenues'>
                                <Route path='view' element={<RevenueReport />}></Route>
                            </Route>
                        </Routes>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AdminPage;