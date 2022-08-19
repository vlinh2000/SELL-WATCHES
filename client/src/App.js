import './App.css';
import 'assets/scss/common.scss';
import { Button } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import Loader from 'components/Loader';
import Header from 'components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element=""></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
