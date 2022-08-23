import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

import './BreadcrumbCustom.scss';

BreadcrumbCustom.propTypes = {

};

function BreadcrumbCustom(props) {
    return (
        <div className='breadcrumb-custom'>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="">Đồng hồ nam</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
        </div>
    );
}

export default BreadcrumbCustom;