import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Col, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { BarsOutlined, BellOutlined, CloseCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSideBar } from 'assets/admin';
import { toggleSideBarOnBigScreen } from 'pages/Admin/adminSlice';

Header.propTypes = {

};

function Header(props) {

    const { user, isAuth } = useSelector(state => state.auth);
    const { isToggleSideBar } = useSelector(state => state.adminInfo);
    const dispatch = useDispatch();

    return (
        <div className='header-admin'>
            <Row justify='space-between' align='middle'>
                <Col xs={7} sm={7} md={7} lg={4}>
                    <div className="left-side">
                        <div className="logo logo-first" >
                            <Link to="/">
                                <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='img' />
                            </Link>
                        </div>
                        <BarsOutlined className='menu-btn' onClick={toggleSideBar} />
                    </div>
                </Col>
                <Col xs={17} sm={17} md={17} lg={20}>
                    <div className="right-side">
                        <BarsOutlined className='menu-btn-big-screen' onClick={() => dispatch(toggleSideBarOnBigScreen(!isToggleSideBar))} />
                        {/* <BellOutlined /> */}
                        <div className='info-auth'>
                            <Link to="/profile">{user?.HO_TEN}</Link>
                            <span className='position'>({user?.TEN_CV})</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Header;