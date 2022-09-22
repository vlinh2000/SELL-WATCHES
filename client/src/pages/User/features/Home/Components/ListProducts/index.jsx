import React from 'react';
import PropTypes from 'prop-types';
import './ListProducts.scss';
import Title from 'components/Title';
import { Row } from 'antd';
import Product from '../Product';
import { sanphamApi } from 'api/sanphamApi';
import { useSelector } from 'react-redux';

ListProducts.propTypes = {
    categoryID: PropTypes.string,
    categoryTitle: PropTypes.string,
    animation: PropTypes.string,
    numProductPerLine: PropTypes.number,
    favouriteList: PropTypes.array,
    productInCartList: PropTypes.array,
    productList: PropTypes.array,
};

ListProducts.defaultProps = {
    categoryID: '',
    categoryTitle: '',
    animation: '',
    numProductPerLine: 4,
    favouriteList: [],
    productInCartList: [],
    productList: [],
};

function ListProducts(props) {
    const { categoryTitle, categoryID, animation, numProductPerLine, favouriteList, productInCartList, productList } = props;
    const { isAuth } = useSelector(state => state.auth)



    return (
        <div className='list-products-wrapper'>
            {categoryTitle && <Title animation={animation}>{categoryTitle}</Title>}
            <Row className='products'>
                {productList?.map((product, idx) => <Product
                    isAuth={isAuth}
                    productInCartList={productInCartList}
                    favouriteList={favouriteList}
                    product={product}
                    numProductPerLine={numProductPerLine}
                    animation={animation}
                    key={idx} />)}
            </Row>
        </div>
    );
}

export default ListProducts;