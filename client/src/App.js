import './App.css';
import 'assets/scss/common.scss';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import UserPage from 'pages/User';
import Admin from 'pages/Admin';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from 'components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { getMe, getNewToken } from 'app/authSlice';
import ScrollTop from 'components/ScrollTop';


function App() {

  const { isAuth } = useSelector(state => state.auth);


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<UserPage />} index></Route>
          <Route path='admin/*' element={<ProtectedRoute isAllow={isAuth}> <Admin /></ProtectedRoute>}></Route>
        </Routes>
        <Toaster position="bottom-left" />
        <ScrollTop />
      </BrowserRouter>
    </div>
  );
}

export default App;
