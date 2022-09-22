import React from 'react';
import PropTypes from 'prop-types';

import './ProductInfo.scss';
import ButtonCustom from 'components/ButtonCustom';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from 'pages/User/userSlice';
import toast from 'react-hot-toast';

ProductInfo.propTypes = {
    product: PropTypes.object
};

ProductInfo.defaultProps = {
    product: {}
};

function ProductInfo(props) {
    const { product } = props;
    const [quantity, setQuantity] = React.useState(1);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity }))
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
    }

    return (
        <div className='product-info'>
            <div className='product-info__name'>{product.TEN_SP}</div>
            <div className='product-info__description'>{product.MO_TA}</div>
            {product.SO_LUONG < 1 && <div className="product-info__status-stock">Sản phẩm này đã hết hàng hoặc không có sẵn.</div>}
            <div className="product-info__group-quantity">
                <Button className='btn-decrease' disabled={quantity < 2} onClick={() => setQuantity(prev => prev - 1)}>-</Button>
                <div className='current-quantity'>{quantity}</div>
                <Button className='btn-increase' disabled={quantity === product.SO_LUONG} onClick={() => setQuantity(prev => prev + 1)}>+</Button>
                <ButtonCustom onClick={handleAddToCart} className="btn-add-to-cart" text="Thêm vào giỏ"></ButtonCustom>
            </div>

            <ul className="product-info__info-list">
                <li className="info-item">
                    Mã: {product.MA_SP}
                </li>
                <li className="info-item">
                    Danh mục: <Link to={`/category/${product.MA_LOAI_SP}`}>{product.TEN_LOAI_SP}</Link>
                </li>
                <li className="info-item">
                    Tags: <Link to={`/category/${product.MA_LOAI_SP}`}>{product.TEN_LOAI_SP}</Link>
                </li>
            </ul>

        </div>
    );
}

export default ProductInfo;