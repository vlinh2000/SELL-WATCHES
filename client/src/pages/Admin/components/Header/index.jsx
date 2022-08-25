import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Col, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';

Header.propTypes = {

};

function Header(props) {
    return (
        <div className='header-admin'>
            <Row justify='space-between' align='middle'>
                <Col xs={7} sm={7} md={7} lg={4}>
                    <div className="left-side">
                        <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='img' />
                    </div>
                </Col>
                <Col xs={10} sm={10} md={10} lg={4}>
                    <div className="right-side">
                        {/* <BellOutlined /> */}
                        <Link to="#">Trương Việt Linh</Link>
                        <span className='position'>(Nhân viên)</span>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Header;