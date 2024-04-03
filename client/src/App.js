import './App.css';
import Login from './component/auth/login'
import Reg from './component/auth/register'
import Home from './component/home/Home'
import Cart from './component/cart/Cart'
import Seller from './component/seller/seller'
import Admin from './component/admin/admin'
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/registration' element={<Reg/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/seller' element={<Seller/>}/>
          <Route path='/admin' element={<Admin/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
