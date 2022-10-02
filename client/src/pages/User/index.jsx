import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Home from './features/Home';
import ProductDetail from './features/ProductDetail';
import Cart from './features/Cart';
import WishList from './features/WishList';
import Contact from './features/Contact';
import Payments from './features/Payment';
import Profile from './features/Profile';
import Header from 'components/Header';
import Auth from './features/Auth';
import Footer from 'components/Footer';
import NotFound from './features/NotFound';
import ProductByCategory from './features/ProductByCategory';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, getNewToken } from 'app/authSlice';
import ProtectedRoute from 'components/ProtectedRoute';
import { isAccountOfThisSite } from 'constants/commonContants';
import { fetch_productTypes, fetch_favouriteList, fetch_my_vouchers, fetch_my_orders, switch_screenLogin } from './userSlice';
import toast from 'react-hot-toast';
import { donhangApi } from 'api/donhangApi';

UserPage.propTypes = {

};

function UserPage(props) {

    const { token, refreshToken, isAuth, user } = useSelector(state => state.auth);
    const { data: { productTypeList, myOrders }, pagination: { myOrders: pagination } } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    React.useEffect(() => {
        const handleGetInfo = async () => {
            if (!token || isAuth) return;
            const { error, payload } = await dispatch(getMe());
            if (error) {
                // get token mới;
                await dispatch(getNewToken({ isUser: user.USER_ID, refreshToken }));
            }
            else if (payload.NV_ID) navigate('/admin/dashboard', { replace: true });
        }

        handleGetInfo();
    }, [token])

    React.useEffect(() => {
        isAuth && dispatch(fetch_favouriteList());
        isAuth && dispatch(fetch_my_vouchers());
        !productTypeList && dispatch(fetch_productTypes());
    }, [isAuth])

    React.useEffect(() => {
        user?.USER_ID && dispatch(fetch_my_orders({ action: 'get_my_orders', _limit: pagination._limit, _page: pagination._page }));
    }, [pagination._limit, pagination._page, user?.USER_ID])

    const onCompleteOrder = async (data) => {
        try {
            await donhangApi.post(data);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        // if(!isAuth)
        const redirect = searchParams.get('redirect');
        const extraData = searchParams.get('extraData');
        const resultCode = searchParams.get('resultCode');
        const action = searchParams.get('action');
        const message = searchParams.get('message');
        setSearchParams({});
        if (resultCode && resultCode == 0) {
            (async () => {
                const data = { isCompleteOrder: true, data: extraData };
                await onCompleteOrder(data);
                dispatch(fetch_my_orders({ action: 'get_my_orders', _limit: pagination._limit, _page: pagination._page }));
                toast.success('Đặt hàng thành công.');
                navigate(redirect, { state: { historyOrder: true } });
            })();
        } else if (resultCode && resultCode !== 0) {
            const msg = `Đặt hàng thất bại (${message})`;
            const idTimeout = setTimeout(() => {
                toast.error(msg);
                clearTimeout(idTimeout);
            }, 1000);
        }
    }, [searchParams])

    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} index></Route>
                <Route path='products' >
                    <Route path=':idProduct' element={<ProductDetail />}></Route>
                </Route>
                <Route path='category/:idCategory' element={<ProductByCategory />}></Route>
                <Route path='cart' element={<Cart />}></Route>
                <Route path='wishlist' element={<ProtectedRoute isAllow={isAuth}><WishList /></ProtectedRoute>}></Route>
                <Route path='contact' element={<Contact />}></Route>
                <Route path='payments' element={<Payments />}></Route>
                <Route path='profile' element={<ProtectedRoute isAllow={isAuth}><Profile /></ProtectedRoute>}></Route>
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
            <Auth />
            <Footer />
        </>
    );
}

export default UserPage;