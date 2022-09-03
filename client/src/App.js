import './App.css';
import 'assets/scss/common.scss';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from 'pages/User';
import Admin from 'pages/Admin';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from 'components/ProtectedRoute';
import { useSelector } from 'react-redux';


function App() {

  const { user, isAuth } = useSelector(state => state.auth);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<UserPage />} index></Route>
          <Route path='admin/*' element={<ProtectedRoute isAllow={isAuth}> <Admin /></ProtectedRoute>}></Route>
        </Routes>
        <Toaster position="bottom-left" />
      </BrowserRouter>
    </div>
  );
}

export default App;
