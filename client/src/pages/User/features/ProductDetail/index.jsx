import { Col, Row } from 'antd';
import { donhangApi } from 'api/donhangApi';
import { sanphamApi } from 'api/sanphamApi';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ListProducts from '../Home/Components/ListProducts';
import GroupInfoAndFeedBack from './components/GroupInfoAndFeedBack';
import GroupProductImage from './components/GroupProductImage';
import ProductInfo from './components/ProductInfo';

ProductDetail.propTypes = {

};



function ProductDetail(props) {
    const { idProduct } = useParams();

    const [product, setProduct] = React.useState();
    const [productSameTypeList, setProductSameTypeList] = React.useState([]);
    const [feedBackAvailable, setFeedBackAvailable] = React.useState(false);
    const { isAuth } = useSelector(state => state.auth);
    const { productInCartListID, data: { favouriteListID } } = useSelector(state => state.userInfo);


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

    React.useEffect(() => {
        const fetchProductSameType = async () => {
            try {
                const { result } = await sanphamApi.getAll({ MA_LOAI_SP: product.MA_LOAI_SP, filterBy: 'MA_LOAI_SP', _page: 1, _limit: 4 });
                setProductSameTypeList(result?.filter(sp => sp.MA_SP !== product.MA_SP));
                console.log({ result });
            } catch (error) {
                console.log({ error })
            }
        }

        product?.MA_LOAI_SP && fetchProductSameType();
    }, [product])

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

        isAuth && checkFeedBackAvailable();
    }, [idProduct, isAuth])

    console.log({ productSameTypeList })

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
            <br />
            <ListProducts
                favouriteList={favouriteListID}
                productInCartList={productInCartListID}
                categoryTitle="Sản phẩm tương tự"
                productList={productSameTypeList}
                numProductPerLine={4} />
        </div>
    );
}

export default ProductDetail;