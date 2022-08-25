import React from 'react';
import PropTypes from 'prop-types';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { Breadcrumb, Col, Row } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import BreadcrumbCustomv2 from './components/BreadcrumbCustomv2';
import EmployeeEdit from './features/Employee/sub-pages';
import Employee from './features/Employee';

AdminPage.propTypes = {

};

function AdminPage(props) {

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
                            <Route index path='dashboard' element={<div className="box">Dashboard</div>}></Route>
                            <Route path='/employees'>
                                <Route path='view' element={<Employee />}></Route>
                                <Route path='edit' element={<EmployeeEdit />}></Route>
                            </Route>
                            <Route path='b' element={<div>b</div>}></Route>
                            <Route path='c' element={<div>c</div>}></Route>
                        </Routes>
                    </div>
                </Col>
            </Row>
            <Toaster position="bottom-left" />
        </div>
    );
}

export default AdminPage;