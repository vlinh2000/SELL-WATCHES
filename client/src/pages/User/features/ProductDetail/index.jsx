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
import { donhangApi } from 'api/donhangApi';

ProductDetail.propTypes = {

};



function ProductDetail(props) {
    const { idProduct } = useParams();

    const [product, setProduct] = React.useState();
    const [feedBackList, setFeedBackList] = React.useState();
    const [feedBackAvailable, setFeedBackAvailable] = React.useState(false);

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

    // check feedback available
    React.useEffect(() => {
        const checkFeedBackAvailable = async () => {
            try {
                const { available } = await donhangApi.getAll({ action: 'check_had_order', MA_SP: idProduct });
                setFeedBackAvailable(available);
            } catch (error) {
                console.log({ error })
            }
        }

        checkFeedBackAvailable();
    }, [idProduct])

    return (
        <div className='product-detail-wrapper'>
            <Row>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <GroupProductImage imageList={product?.ANH_SAN_PHAM} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <BreadcrumbCustom category={{ MA_LOAI_SP: product?.MA_LOAI_SP, TEN_LOAI_SP: product?.TEN_LOAI_SP, MA_SP: product?.MA_SP, TEN_SP: product?.TEN_SP }} />
                    <ProductInfo product={product} />
                </Col>
            </Row>
            <GroupInfoAndFeedBack product={product} feedBackAvailable={feedBackAvailable} />
        </div>
    );
}

export default ProductDetail;