import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Col, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

Header.propTypes = {

};

function Header(props) {

    const { user, isAuth } = useSelector(state => state.auth);
    return (
        <div className='header-admin'>
            <Row justify='space-between' align='middle'>
                <Col xs={7} sm={7} md={7} lg={4}>
                    <div className="left-side">
                        <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='img' />
                    </div>
                </Col>
                <Col xs={17} sm={17} md={17} lg={20}>
                    <div className="right-side">
                        {/* <BellOutlined /> */}
                        <Link to="/profile">{user?.HO_TEN}</Link>
                        <span className='position'>({user?.TEN_CV})</span>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Header;