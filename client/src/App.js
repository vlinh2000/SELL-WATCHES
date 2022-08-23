import './App.css';
import 'assets/scss/common.scss';
import 'aos/dist/aos.css';
import { Button } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import Loader from 'components/Loader';
import Header from 'components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from 'components/Footer';
import Home from 'features/Home';
import Products from 'features/ProductByCategory';
import ProductDetail from 'features/ProductDetail';
import Cart from 'features/Cart';
import WishList from 'features/WishList';
import Contact from 'features/Contact';
import Payments from 'features/Payment';
import Auth from 'features/Auth';
import Profile from 'features/Profile';
import NotFound from 'features/NotFound';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} index></Route>
          <Route path='products' >
            <Route path=':idProduct' element={<ProductDetail />}></Route>
          </Route>
          <Route path='category/:idCategory' element={<Products />}></Route>
          <Route path='cart' element={<Cart />}></Route>
          <Route path='wishlist' element={<WishList />}></Route>
          <Route path='contact' element={<Contact />}></Route>
          <Route path='payments' element={<Payments />}></Route>
          <Route path='profile' element={<Profile />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
        <Auth />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
