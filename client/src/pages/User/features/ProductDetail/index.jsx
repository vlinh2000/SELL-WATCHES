import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Col, Row } from 'antd';
import GroupProductImage from './components/GroupProductImage';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import ProductInfo from './components/ProductInfo';
import GroupInfoAndFeedBack from './components/GroupInfoAndFeedBack';
import { useParams } from 'react-router-dom';
import { sanphamApi } from 'api/sanphamApi';
import { danhgiaApi } from 'api/danhgiaApi';

ProductDetail.propTypes = {

};



function ProductDetail(props) {
    const { idProduct } = useParams();

    const [product, setProduct] = React.useState();
    const [feedBackList, setFeedBackList] = React.useState();

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { result } = await sanphamApi.get(idProduct);
                setProduct(result)
                console.log({ result });
            } catch (error) {
                console.log({ error })
            }
        }

        fetchProduct();
    }, [idProduct])

    return (
        <div className='product-detail-wrapper'>
            <Row>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <GroupProductImage imageList={product?.ANH_SAN_PHAM} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <BreadcrumbCustom />
                    <ProductInfo product={product} />
                </Col>
            </Row>
            <GroupInfoAndFeedBack product={product} />
        </div>
    );
}

export default ProductDetail;