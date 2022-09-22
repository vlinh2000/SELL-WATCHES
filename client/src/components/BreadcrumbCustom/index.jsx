import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

import './BreadcrumbCustom.scss';

BreadcrumbCustom.propTypes = {
    category: PropTypes.object,
    more: PropTypes.string
};

BreadcrumbCustom.defaultProps = {
    category: { TEN_LOAI_SP: '', TEN_SP: '', MA_LOAI_SP: '', MA_SP: '' },
    more: ''
};

function BreadcrumbCustom(props) {
    const { category, more } = props;
    return (
        <div className='breadcrumb-custom'>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="">Trang chủ</Link>
                </Breadcrumb.Item>
                {
                    category?.MA_LOAI_SP &&
                    <Breadcrumb.Item>
                        <Link to={`/category/${category?.MA_LOAI_SP}`}>{category?.TEN_LOAI_SP}</Link>
                    </Breadcrumb.Item>
                }
                {
                    category?.MA_SP &&
                    <Breadcrumb.Item>
                        <Link to={`/category/${category?.MA_SP}`}>{category?.TEN_SP}</Link>
                    </Breadcrumb.Item>
                }
                {
                    more &&
                    <Breadcrumb.Item>{more}</Breadcrumb.Item>
                }
            </Breadcrumb>
        </div>
    );
}

export default BreadcrumbCustom;