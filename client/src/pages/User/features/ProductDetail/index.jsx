import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Col, Row } from 'antd';
import GroupProductImage from './components/GroupProductImage';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import ProductInfo from './components/ProductInfo';
import GroupInfoAndFeedBack from './components/GroupInfoAndFeedBack';

ProductDetail.propTypes = {

};



function ProductDetail(props) {
    return (
        <div className='product-detail-wrapper'>
            <Row>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <GroupProductImage />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <BreadcrumbCustom />
                    <ProductInfo />
                </Col>
            </Row>
            <GroupInfoAndFeedBack />
        </div>
    );
}

export default ProductDetail;