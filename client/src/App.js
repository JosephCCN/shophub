import './App.css';
import Login from './component/auth/login'
import Reg from './component/auth/register'
import Home from './component/home/Home'
import Cart from './component/cart/Cart'
import Seller from './component/seller/seller'
import Admin from './component/admin/admin'
import AddProduct from'./component/seller/add_product'
import EditProduct from './component/seller/edit_product'
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
<<<<<<< HEAD
          <Route path='/seller/add_product' element={<AddProduct/>}></Route>
          <Route path='/seller/edit_product' element={<EditProduct/>}></Route>
=======
          <Route exact path='/product/:productID' element={<SpecificProduct/>}/>
          <Route path='*' element={<Navigate to="/home"/>}/>
>>>>>>> 059a203942436bf64a356808119b6d3e3795d3b1
        </Routes>
      </Router>
    </div>
  );
}

export default App;
