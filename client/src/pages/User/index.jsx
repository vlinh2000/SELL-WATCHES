import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
import { fetch_productTypes, fetch_favouriteList, fetch_my_vouchers, fetch_my_orders } from './userSlice';

UserPage.propTypes = {

};

function UserPage(props) {

    const { token, refreshToken, isAuth, user } = useSelector(state => state.auth);
    const { data: { productTypeList, myOrders }, pagination } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        console.log({})
        !Array.isArray(myOrders) && user?.USER_ID && dispatch(fetch_my_orders({ action: 'get_my_orders', _limit: pagination.myOrders._limit, _page: pagination.myOrders._page }));
    }, [pagination.myOrders, user?.USER_ID, myOrders])

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