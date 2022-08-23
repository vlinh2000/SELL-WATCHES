import React from 'react';
import PropTypes from 'prop-types';
import './ListProducts.scss';
import Title from 'components/Title';
import { Row } from 'antd';
import Product from '../Product';

ListProducts.propTypes = {
    category: PropTypes.string,
    animation: PropTypes.string,
    numProductPerLine: PropTypes.number
};

ListProducts.defaultProps = {
    category: '',
    animation: '',
    numProductPerLine: 4
};

function ListProducts(props) {
    const { category, animation, numProductPerLine } = props;
    const products = new Array(10).fill(0);

    return (
        <div className='list-products-wrapper'>
            {category && <Title animation={animation}>{category}</Title>}
            <Row className='products'>
                {products.map((x, idx) => <Product numProductPerLine={numProductPerLine} animation={animation} key={idx} />)}
            </Row>
        </div>
    );
}

export default ListProducts;