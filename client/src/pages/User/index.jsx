import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
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

UserPage.propTypes = {

};

function UserPage(props) {
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
                <Route path='wishlist' element={<WishList />}></Route>
                <Route path='contact' element={<Contact />}></Route>
                <Route path='payments' element={<Payments />}></Route>
                <Route path='profile' element={<Profile />}></Route>
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
            <Auth />
            <Footer />
        </>
    );
}

export default UserPage;