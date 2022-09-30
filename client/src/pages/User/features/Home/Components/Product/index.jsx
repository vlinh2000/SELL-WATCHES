import { DotChartOutlined, EyeFilled, EyeOutlined, EyeTwoTone, HeartFilled, HeartOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Col, message, Skeleton, Space, Spin, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Product.scss';
import Proptypes from 'prop-types';
import { numberWithCommas } from 'assets/admin';
import toast, { LoaderIcon } from 'react-hot-toast';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToFavouriteList, fetch_favouriteList } from 'pages/User/userSlice';
import { yeuthichApi } from 'api/yeuthichApi';
import Loader from 'components/Loader';
import ButtonCustom from 'components/ButtonCustom';

Product.propTypes = {
    product: Proptypes.object,
    favouriteList: Proptypes.array,
    productInCartList: Proptypes.array,
    isAuth: Proptypes.bool,

};

Product.defaultProps = {
    product: {},
    favouriteList: [],
    productInCartList: [],
    isAuth: false,
};

function Product(props) {
    const { animation, numProductPerLine, product, favouriteList, productInCartList, isAuth } = props;
    const [status, setStatus] = React.useState({ id: null, loading: false });
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleFavouriteList = async (idProduct, action = 'ADD') => {
        try {
            if (!isAuth) return toast.error("Vui lòng đăng nhập.")
            setStatus({ id: idProduct, loading: true });
            const { message } = action === 'ADD' ? await yeuthichApi.post({ MA_SP: idProduct }) : await yeuthichApi.delete(idProduct);
            dispatch(fetch_favouriteList());
            setStatus(({ id: null, loading: false }));
            toast.success(message);

        } catch (error) {
            setStatus(({ id: null, loading: false }));
            toast.error(error.response.data.message);
        }

    }

    const handleAddToCart = (product) => {
        dispatch(addToCart({ product }));
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
    }


    return (
        <Col xs={24} sm={24} md={24 / (numProductPerLine - 1)} lg={24 / numProductPerLine} style={{ padding: '10px' }}>
            {
                false ?
                    <div className="skeleton-styled">
                        <Skeleton.Avatar active={true} shape="square" size="large" />
                        <Skeleton active={true} paragraph={{ rows: 4 }} title={{ width: '100%' }} />
                    </div>
                    :
                    <div className="product">
                        <div data-aos={animation || ''}>
                            <Link to={`/products/${product.MA_SP}`}>
                                <img width={300} height={300} className='product__image' src={product.HINH_ANH} alt='product' />
                            </Link>
                            <div className='product__category'>{product.TEN_DANH_MUC}</div>
                            <Link to={`/products/${product.MA_SP}`} className='product__name'>{product.TEN_SP}</Link>
                            <div className='product__price'>
                                {/* <div className="old-price">20,217,000&nbsp;₫</div> */}
                                <div className="price">{numberWithCommas(product.GIA_BAN)}&nbsp;₫</div>
                            </div>
                            {
                                product.SO_LUONG > 0 &&
                                <div className="product__btn-add-to-cart">
                                    <Tooltip title={productInCartList?.includes(product.MA_SP) ? "Xem giỏ hàng" : "Thêm vào giỏ"} placement='top'>
                                        {
                                            productInCartList?.includes(product.MA_SP)
                                                ? <SearchOutlined className='add-to-cart-icon' onClick={() => navigate("/cart")} />
                                                : <ShoppingOutlined className='add-to-cart-icon' onClick={() => handleAddToCart(product)} />
                                        }
                                    </Tooltip>
                                </div>
                            }
                            <div className="product__btn-like">
                                {
                                    !favouriteList?.includes(product.MA_SP) ?
                                        <Tooltip title="Thêm vào yêu thích" placement='top'>
                                            {
                                                (status.id === product.MA_SP && status.loading) ? <Spin /> :
                                                    <HeartOutlined className='like-icon' onClick={() => handleFavouriteList(product.MA_SP)} />
                                            }

                                        </Tooltip>
                                        : <Tooltip title="Xóa sản phẩm này khỏi danh sách yêu thích." placement='top'>
                                            <HeartFilled
                                                onClick={() => handleFavouriteList(product.MA_SP, 'DELETE')}
                                                className='like-icon' style={{ color: '#FF4136' }} />
                                        </Tooltip>
                                }
                            </div>
                            {product.SO_LUONG < 1 && <div className="product__out-of-stock">Hết hàng</div>}
                            {/* <div className="product__discount">10%</div> */}
                        </div>
                    </div>
            }

        </Col>
    );
}

export default Product;