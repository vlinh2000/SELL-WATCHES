import React from 'react';
import PropTypes from 'prop-types';
import SideBar from './components/SideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { Breadcrumb, Col, Row } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import BreadcrumbCustomv2 from './components/BreadcrumbCustomv2';
import EmployeeEdit from './features/Employee/sub-pages';
import Employee from './features/Employee';
import Dashboard from './features/DashBoard';
import Positon from './features/Position';
import PositionEdit from './features/Position/sub-pages';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_brands, fetch_categories, fetch_employees, fetch_orders, fetch_orders_pending, fetch_positions, fetch_products, fetch_productTypes, fetch_receipts, fetch_suppliers, fetch_users } from './adminSlice';
import ProductType from './features/ProductType';
import ProductTypeEdit from './features/ProductType/sub-pages';
import Category from './features/Category';
import CategoryEdit from './features/Category/sub-pages/CategoryEdit';
import Brand from './features/Brand';
import BrandEdit from './features/Brand/sub-pages';
import User from './features/User';
import Supplier from './features/Supplier';
import SupplierEdit from './features/Supplier/sub-pages';
import Receipt from './features/Receipt';
import ReceiptEdit from './features/Receipt/sub-pages';
import Product from './features/Product';
import ProductEdit from './features/Product/sub-pages';
import Order from './features/Order';
import OrderEdit from './features/Order/sub-pages';
import OrderConfirm from './features/Order/sub-pages';

AdminPage.propTypes = {

};

function AdminPage(props) {

    const {
        pagination } = useSelector(state => state.adminInfo);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetch_positions({ _limit: pagination.positions._limit, _page: pagination.positions._page }));
    }, [pagination.positions])

    React.useEffect(() => {
        dispatch(fetch_productTypes({ _limit: pagination.productTypes._limit, _page: pagination.productTypes._page }));
    }, [pagination.productTypes])

    React.useEffect(() => {
        dispatch(fetch_categories({ _limit: pagination.categories._limit, _page: pagination.categories._page }));
    }, [pagination.categories])

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
        dispatch(fetch_suppliers({ _limit: pagination.suppliers._limit, _page: pagination.suppliers._page }));
    }, [pagination.suppliers])

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
        dispatch(fetch_orders({ _limit: pagination.orders._limit, _page: pagination.orders._page }));
    }, [pagination.orders])

    React.useEffect(() => {
        dispatch(fetch_orders_pending({ _limit: pagination.ordersConfirm._limit, _page: pagination.ordersConfirm._page, status: 0 }));
    }, [pagination.ordersConfirm])

    return (
        <div className='admin-page'>
            <Header />
            <Row>
                <Col xs={24} sm={24} md={7} lg={4}>
                    <SideBar />
                </Col>
                <Col xs={24} sm={24} md={17} lg={20}>
                    <div className="main-wrapper">
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
                            <Route path='/categories'>
                                <Route path='view' element={<Category />}></Route>
                                <Route path='edit' element={<CategoryEdit />}></Route>
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
                            <Route path='b' element={<div>b</div>}></Route>
                            <Route path='c' element={<div>c</div>}></Route>
                        </Routes>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AdminPage;