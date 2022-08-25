import './App.css';
import 'assets/scss/common.scss';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from 'pages/User';
import Admin from 'pages/Admin';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<UserPage />} index></Route>
          <Route path='admin/*' element={<Admin />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
