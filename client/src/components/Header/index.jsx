import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Divider, Popover, Row, Skeleton, Tooltip } from 'antd'
import { BarsOutlined, CloseOutlined, EnvironmentOutlined, FacebookFilled, FacebookOutlined, HeartOutlined, InstagramOutlined, PhoneOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined, TwitterOutlined } from '@ant-design/icons';
import ButtonCustom from 'components/ButtonCustom';
import { useDispatch, useSelector } from 'react-redux';
import { onFilter, onSearch, removeFromCart, switch_screenLogin, switch_suggestionModal } from 'pages/User/userSlice';
import { numberWithCommas } from 'assets/admin';
import { getTotalPrice } from 'assets/common';
import { sanphamApi } from 'api/sanphamApi';
import reactStringReplace from 'react-string-replace';

Header.propTypes = {

};


function CartInfo(props) {
    const { productList } = props;
    console.log({ productList })
    const dispatch = useDispatch();
    return (
        <div className='cart-info'>
            <ul className="list-item">
                {
                    productList?.map((product, idx) =>
                        <li key={idx} className="item">
                            <Row>
                                <Col className='item-image' span={6}>
                                    <img src={(product?.ANH_SAN_PHAM?.length > 0 && product?.ANH_SAN_PHAM[0]?.HINH_ANH) || product?.HINH_ANH} alt='image' />
                                </Col>
                                <Col className='item-info' span={14}>
                                    <Link to="" className='item-name'>{product?.TEN_SP}</Link>
                                    <div className='item-quantity-price'>{product?.SL_TRONG_GIO} x <strong>{numberWithCommas(product?.GIA_BAN || 0)}&nbsp;₫</strong></div>
                                </Col>
                                <Col span={4} style={{ textAlign: 'right' }}>
                                    <Button size='small' onClick={() => dispatch(removeFromCart(product?.MA_SP))} icon={<CloseOutlined />} shape="circle" />
                                </Col>
                            </Row>
                        </li>
                    )
                }
                {/* not item in cart */}
                {
                    productList?.length === 0 &&
                    <li>
                        <p style={{ color: '#777' }}>Chưa có sản phẩm trong giỏ hàng.</p>
                    </li>
                }
            </ul>
            <div className='item total-price'>
                {/* <div>...</div> */}
                <strong className='total-price-title'>Tổng tiền:</strong> <strong className='total-price-num'>{numberWithCommas(getTotalPrice(productList, 'GIA_BAN', 'SL_TRONG_GIO'))}&nbsp;₫</strong>
            </div>
            <Link className='btnCustom' style={{ backgroundColor: '#c89979' }} to="/cart">Xem giỏ hàng</Link>
            <Link className='btnCustom' to="/payments">Thanh toán</Link>
        </div>
    );
}


function Header(props) {

    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuth } = useSelector(state => state.auth);
    const { cart, data: { favouriteList, productTypeList }, isVisibleSuggestionModal } = useSelector(state => state.userInfo);
    const typingTimeoutRef = React.useRef(null);
    const [searchValue, setSearchValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [productSuggestions, setProductSuggestions] = React.useState([]);
    const [totalSearchFound, setTotalSearchFound] = React.useState(0);

    const handleShowNavbar = () => {
        document.querySelector('.hide-bg').style.display = 'block';
        const navbar = document.querySelector('.header-wrapper__header__navbar');
        navbar.style.opacity = 1;
        navbar.style.visibility = 'visible';
        navbar.style.width = '50%';
    }

    const handleCloseNavbar = () => {
        document.querySelector('.hide-bg').style.display = 'none';
        const navbar = document.querySelector('.header-wrapper__header__navbar');
        navbar.style.opacity = 0;
        navbar.style.visibility = 'hidden';
        navbar.style.width = '0';

    }

    const handleChange = ({ target }) => {

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setSearchValue(target.value);
        }, 500)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(onSearch(searchValue))
        setSearchValue("");
        dispatch(switch_suggestionModal(false))
        navigate('/category/all');
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { result, totalRecord } = await sanphamApi.getAll({ searchValue, _limit: 4, _page: 1 });
                setProductSuggestions(result);
                setTotalSearchFound(totalRecord)
                setLoading(false);
            } catch (error) {
                console.log({ error })
                setLoading(false);
            }
        }

        fetchData();
    }, [searchValue])

    return (
        <div className='header-wrapper'>
            <div className="header-wrapper__header">
                <div className="header-wrapper__header__top-nav">
                    <div className="header-wrapper__header__top-nav__left">
                        <EnvironmentOutlined className='icon' />
                        <span className='address'>319 - C16 Lý Thường Kiệt, P.15, Q.11, Tp.HCM</span>
                        <PhoneOutlined className='icon' />
                        <span>076 922 1111</span>
                    </div>
                    <div className="header-wrapper__header__top-nav__right">
                        <Tooltip title="Follow on facebook">
                            <a href='https://facebook.com' target='_blank'>
                                <FacebookFilled />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Instagram">
                            <a href='https://instagram.com' target='_blank'>
                                <InstagramOutlined />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Twitter">
                            <a href='https://twitter.com' target='_blank'>
                                <TwitterOutlined />
                            </a>
                        </Tooltip>
                        {
                            isAuth
                                ? <Link className='user' to="/profile">{user?.HO_TEN || user?.EMAIL}</Link>
                                : <Link className='user' to="" onClick={() => dispatch(switch_screenLogin(true))}>Đăng nhập/đăng ký</Link>
                        }
                    </div>
                </div>
                <div className="header-wrapper__header__main-nav">
                    <div className="logo">
                        <img src='https://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/logo-mona-2.png' alt='logo' />
                    </div>
                    <div className="search">
                        <form className='form-search'>
                            <input
                                onBlur={() => dispatch(switch_suggestionModal(false))}
                                onFocus={() => dispatch(switch_suggestionModal(true))} onChange={handleChange} className='search-input' name='searchValue' type="text" placeholder="Tìm kiếm ..." />
                            <button className='btn-search' type='submit' onClick={handleSearch}>
                                <SearchOutlined />
                            </button>
                            <ul
                                tabIndex={0}
                                style={{ display: isVisibleSuggestionModal ? 'block' : 'none' }}
                                className='suggestions-wrapper'>
                                {
                                    loading ? new Array(4).fill(0).map((_, idx) =>
                                        <li
                                            key={idx} className='suggestions-wrapper__item'>
                                            <Row>
                                                <Col xs={24} sm={12} md={5}>
                                                    <Skeleton.Image style={{ width: 50, height: 40 }} size="small" active={true} />
                                                </Col>
                                                <Col xs={24} sm={12} md={19}>
                                                    <Skeleton title={false} paragraph={{ rows: 2 }} active={true} size="small" />
                                                </Col>
                                            </Row>
                                        </li>
                                    )
                                        :
                                        productSuggestions?.map((product, idx) =>
                                            <li key={idx} className='suggestions-wrapper__item'>
                                                <Link
                                                    onMouseDown={() => {
                                                        setSearchValue("")
                                                        document.querySelector('input[name="searchValue"]').value = "";
                                                        navigate(`/products/${product.MA_SP}`)
                                                    }
                                                    }
                                                    onClick={() => dispatch(switch_suggestionModal(false))}
                                                    to="" className='suggestions-wrapper__item__content'>
                                                    <img width={40} height={50} src={product.HINH_ANH} />
                                                    <div className='info'>
                                                        <div>{reactStringReplace(product.TEN_SP, searchValue, (match, i) => <span style={{ color: 'red' }}>{match}</span>)}</div>
                                                        <div><span className='category'>{reactStringReplace(product.TEN_LOAI_SP, searchValue, (match, i) => <span style={{ color: 'red' }}>{match}</span>)}</span><Divider type="vertical" /><strong className='price'>{numberWithCommas(product.GIA_BAN || 0)}&nbsp;₫</strong></div>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                }
                                {
                                    totalSearchFound === 0 && <li className='suggestions-wrapper__item'>
                                        <div>Không tìm thấy sản phẩm phù hợp.</div>
                                    </li>
                                }
                                {
                                    totalSearchFound > 4 && !loading &&
                                    <li className='suggestions-wrapper__item view-all'>
                                        <Link to="" onMouseDown={handleSearch} className='suggestions-wrapper__item__content'>Xem tất cả {totalSearchFound} sản phẩm</Link>
                                    </li>
                                }
                            </ul>
                        </form>
                    </div>
                    <div className="right">
                        <div className="badge-custom">
                            <Link to="/wishlist"><HeartOutlined className='icon' /></Link>
                            {favouriteList?.length > 0 && <span className='num'>{favouriteList.length}</span>}
                        </div>
                        <Popover placement='bottomLeft' content={<CartInfo productList={cart} />} trigger="click">
                            <div className="card-custom">
                                <ShoppingOutlined className='icon' />
                                {cart?.length > 0 && <span className='num'>{cart.length}</span>}
                            </div>
                        </Popover>
                        <BarsOutlined className="menu-custom" onClick={handleShowNavbar} />
                    </div>
                </div>
                <div className="header-wrapper__header__navbar">
                    <ul className='navbar-list'>
                        <li className="navbar-item">
                            <Link to="" className={pathname === '/' ? 'active' : ''}>Trang Chủ</Link>
                        </li>
                        {
                            productTypeList?.map((category, idx) =>
                                <li key={idx} className="navbar-item">
                                    <Link className={pathname?.includes(category.MA_LOAI_SP) ? 'active' : ''} to={`/category/${category.MA_LOAI_SP}`}>{category.TEN_LOAI_SP}</Link>
                                </li>
                            )
                        }
                        <li className="navbar-item">
                            <Link to="/contact" className={pathname?.includes('contact') ? 'active' : ''} >Liên hệ</Link>
                        </li>
                        <li className="navbar-item user-logged">
                            <Link to="">Đăng nhập</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="hide-bg">
                <Button className='btn-close' onClick={handleCloseNavbar} icon={<CloseOutlined />} shape="circle"></Button>
            </div>
        </div>

    );
}

export default Header;