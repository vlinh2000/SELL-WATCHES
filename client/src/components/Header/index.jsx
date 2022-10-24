import { AudioOutlined, BarsOutlined, CloseOutlined, ConsoleSqlOutlined, EnvironmentOutlined, FacebookFilled, HeartOutlined, InstagramOutlined, PhoneOutlined, SearchOutlined, ShoppingOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popover, Row, Skeleton, Tooltip } from 'antd';
import { sanphamApi } from 'api/sanphamApi';
import { numberWithCommas } from 'assets/admin';
import { getTotalPrice } from 'assets/common';
import SpeechReconigtion from 'components/SpeechRecognition';
import { onSearch, removeFromCart, switch_screenLogin, switch_suggestionModal } from 'pages/User/userSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import './Header.scss';

Header.propTypes = {

};


function CartInfo(props) {
    const { productList } = props;
    const dispatch = useDispatch();

    return (
        <div className='cart-info'>
            <ul className="list-item">
                {
                    productList?.map((product, idx) =>
                        <li key={'product' + idx} className="item">
                            <Row>
                                <Col className='item-image' span={6}>
                                    <img src={(product?.ANH_SAN_PHAM?.length > 0 && product?.ANH_SAN_PHAM[0]?.HINH_ANH) || product?.HINH_ANH} alt='product-img' />
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
            <Link className='btnCustom'
                // style={{ backgroundColor: '#c89979' }}
                to="/cart">Xem giỏ hàng</Link>
            <Link className='btnCustom' to="/payments">Thanh toán</Link>
        </div>
    );
}

const audioList = {
    open: 'https://res.cloudinary.com/vlinh/video/upload/v1666579017/images-tieuluan/open_pbbq0h.m4a',
    success: 'https://res.cloudinary.com/vlinh/video/upload/v1666579017/images-tieuluan/success_e3al2w.m4a',
    failure: 'https://res.cloudinary.com/vlinh/video/upload/v1666579017/images-tieuluan/failure_rrqteg.m4a',
    noInput: 'https://res.cloudinary.com/vlinh/video/upload/v1666579017/images-tieuluan/no_input_glnffd.m4a'
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

    const [speechToText, setSpeechToText] = React.useState();
    const [showModalSpeechRecognition, setshowModalSpeechRecognition] = React.useState(false);

    const [contentListened, setContentListened] = React.useState('');
    const [isErrorReconigtion, setIsErrorReconigtion] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);

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
        console.log({ searchValue })
        const fetchData = async () => {
            try {
                setLoading(true);
                const { result, totalRecord } = await sanphamApi.getAll({ searchValue, _limit: 4, _page: 1 });
                setProductSuggestions(result);
                setTotalSearchFound(totalRecord)
                setLoading(false);

                const searchInput = document.querySelector('input[name="searchValue"');
                // searchInput.value = contentListened;
                // setContentListened('');
                searchInput.focus();
            } catch (error) {
                console.log({ error })
                setLoading(false);
            }
        }

        fetchData();
    }, [searchValue])


    React.useEffect(() => {
        var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
        var recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setSpeechToText(recognition);
    }, [])


    React.useEffect(() => {
        if (speechToText == null) return;

        speechToText.onresult = function (event) {
            var result = event.results[0][0].transcript;
            console.log("Đã nghe: " + result);
            setContentListened(result);
            handlePlayAudio('success');


            const idTimeout = setTimeout(() => {
                setIsListening(false);
                setIsErrorReconigtion(false);
                handleSwitchSpeechRecognition(false);
                clearTimeout(idTimeout);
                console.log("stop");
            }, 2000);
            // console.log('Confidence: ' + event.results[0][0].confidence);
        }

        speechToText.onstart = function () {
            setIsListening(true);
        }

        speechToText.onspeechend = function () {
            console.log({ contentListened, status: "dừng", test: contentListened !== '' })
            speechToText.stop();
            if (contentListened !== '') {
                console.log({ contentListened, status: "dừng" })
                handlePlayAudio('noInput')
                setIsErrorReconigtion(true);
                setIsListening(false);
            }
        }

        // speechToText.onnomatch = function (event) {
        //     console.log("no match");
        // }

        speechToText.onerror = function (event) {
            // handlePlayAudio('failure')
            handlePlayAudio('noInput')
            setIsErrorReconigtion(true);
            setIsListening(false);
        }

    }, [speechToText])

    const handleMapDataToSearchInput = () => {
        const searchInput = document.querySelector('input[name="searchValue"');
        searchInput.value = contentListened;
        setSearchValue(contentListened);
        setContentListened('');

    }

    React.useEffect(() => {
        contentListened && !showModalSpeechRecognition && handleMapDataToSearchInput();
    }, [contentListened, showModalSpeechRecognition])

    const handlePlayAudio = (status) => {
        const audioTag = document.querySelector('#audioSearch');
        audioTag.src = audioList[status];
        audioTag.play();
    }


    const handleSearchVoice = () => {
        // setSearchValue('');
        handlePlayAudio('open');
        setIsErrorReconigtion(false);
        setshowModalSpeechRecognition(true);
        speechToText.start()
    }

    const handleSwitchSpeechRecognition = (isOpen) => {
        setshowModalSpeechRecognition(isOpen);
    }

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
                            <a href='https://facebook.com' target='_blank' rel="noreferrer" >
                                <FacebookFilled />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Instagram">
                            <a href='https://instagram.com' target='_blank' rel="noreferrer">
                                <InstagramOutlined />
                            </a>
                        </Tooltip>
                        <Tooltip title="Follow on Twitter">
                            <a href='https://twitter.com' target='_blank' rel="noreferrer">
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
                                onFocus={() => dispatch(switch_suggestionModal(true))}
                                onChange={handleChange} className='search-input'
                                name='searchValue'
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..." />
                            <div className='voice-container'>
                                <AudioOutlined onClick={handleSearchVoice} className="audio-icon" />
                            </div>
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
                                            key={'skeleton' + idx} className='suggestions-wrapper__item'>
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
                                            <li key={'suggestion' + idx} className='suggestions-wrapper__item'>
                                                <Link
                                                    onMouseDown={() => {
                                                        setSearchValue("")
                                                        document.querySelector('input[name="searchValue"]').value = "";
                                                        navigate(`/products/${product.MA_SP}`)
                                                    }
                                                    }
                                                    onClick={() => dispatch(switch_suggestionModal(false))}
                                                    to="" className='suggestions-wrapper__item__content'>
                                                    <img width={40} height={50} src={product.HINH_ANH} alt='product-img' />
                                                    <div className='info'>
                                                        <div className='product-name'>{reactStringReplace(product.TEN_SP, searchValue, (match, i) => <span style={{ color: 'red' }}>{match}</span>)}</div>
                                                        <div className='info-bottom'><span className='category'>{reactStringReplace(product.TEN_LOAI_SP, searchValue, (match, i) => <span style={{ color: 'red' }}>{match}</span>)}</span><Divider type="vertical" /><strong className='price'>{numberWithCommas(product.GIA_BAN || 0)}&nbsp;₫</strong></div>
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
                                <li key={'category' + idx} className="navbar-item">
                                    <Link className={pathname?.includes(category.MA_LOAI_SP) ? 'active' : ''} to={`/category/${category.MA_LOAI_SP}`}>{category.TEN_LOAI_SP}</Link>
                                </li>
                            )
                        }
                        <li className="navbar-item">
                            <Link to="/contact" className={pathname?.includes('contact') ? 'active' : ''} >Liên hệ</Link>
                        </li>
                        <li className="navbar-item user-logged" onClick={() => {
                            handleCloseNavbar();
                            dispatch(switch_screenLogin(true))
                        }
                        }>
                            <Link to="">Đăng nhập</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="hide-bg">
                <Button className='btn-close' onClick={handleCloseNavbar} icon={<CloseOutlined />} shape="circle"></Button>
            </div>
            <SpeechReconigtion
                isListening={isListening}
                onSearchVoice={handleSearchVoice}
                isError={isErrorReconigtion}
                contentListened={contentListened}
                visible={showModalSpeechRecognition}
                onSwitchModal={handleSwitchSpeechRecognition} />
            <audio id='audioSearch' src=''></audio>
        </div>

    );
}

export default Header;