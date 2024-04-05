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
import Profile from './component/profile/profile';
import EditProfile from './component/profile/edit_profile';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/registration' element={<Reg/>}/>
          <Route exact path='/profile/:profile_userid' element={<Profile/>}/>
          <Route exact path='/profile' element={<Profile/>}/>
          <Route path='/profile/edit_profile' element={<EditProfile/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/seller' element={<Seller/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/seller/add_product' element={<AddProduct/>}></Route>
          <Route path='/seller/edit_product' element={<EditProduct/>}></Route>
          <Route exact path='/product/:productID' element={<SpecificProduct/>}/>
          <Route path='*' element={<Navigate to="/home"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
