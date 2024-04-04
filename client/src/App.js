import './App.css';
import Login from './component/auth/login'
import Reg from './component/auth/register'
import Home from './component/home/Home'
import Cart from './component/cart/Cart'
import Seller from './component/seller/seller'
import Admin from './component/admin/admin'
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom'
import SpecificProduct from './component/search-bar/specific-product';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/registration' element={<Reg/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/seller' element={<Seller/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route exact path='/product/:productID' element={<SpecificProduct/>}/>
          <Route path='*' element={<Navigate to="/home"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
