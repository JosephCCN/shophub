// Importing Link from react-router-dom to 
// navigate to different end points.
import './css/Home.css';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import Bar from '../search-bar/bar'
import ListProduct from "../search-bar/list_product";
import Profile from '../profile/profile';
import Recommendation from '../recommendation/recommendation';

function Actual_home() {
  const [product_info, setProductInfo] = useState({});
  const [searched, setSearched] = useState(false);
  const cookies = new Cookies();
  const userid = cookies.get('userid');
  const navigate = useNavigate();

  const [logOut, setLogout] = useState(0);
  var [gotoSell, setGoToSell] = useState(0);
  var [profile, setprofile] = useState(0);
  var [gotoCart, setGoToCart] = useState(0);
  var [gotoWishlist, setgotoWishlist] = useState(0);

  const logout = () => {
    setLogout(1);
  };

  const GotoCart = () => {
    setGoToCart(1);
  }

  useEffect(() => {
    if(!logOut) return
    cookies.remove('userid', {
      path: '/'
    });
    cookies.remove('admin', {
      path: '/'
    });
    navigate('/login');
  }, [logOut])


  const GotoSell = () => {
    setGoToSell(1);
  }
  useEffect(() => {
      if(!gotoSell) return;
      gotoSell = 0;
      navigate('/seller');
  }, [gotoSell])
  

  const GotoProfile = () =>{
    setprofile(userid); 
  }
  useEffect(() => {
      if(!profile) return;
      navigate(`/profile/${profile}`);
  }, [profile])

  useEffect(() => {
    if(!gotoCart) return;
    gotoCart = 0;
    navigate('/cart');
  }, [gotoCart])


  const GotoWishlist = () => {
    setgotoWishlist(1);
  }
  useEffect(() => {
      if(!gotoWishlist) return;
      navigate(`/wishlist`)
  }, [gotoWishlist])

  return (
    <body>
      <nav className='header'>
        <div className='clearfix'>
          <div className='hometopright'>
            <ul>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
                <li>
                  <button onClick={GotoWishlist}>Wishlist</button>
                </li>
                <li>
                  <button onClick={GotoCart}>Shopping Cart</button>
                </li>
                <li>
                <button onClick={GotoSell}>Sell History</button>
                </li>
                <li>
                  <button>History</button>
                </li>
                <li>
                  <button onClick={GotoProfile}>Profile</button>
                </li>
              </ul>
          </div>   
        </div>
      </nav>
      <div className='searching'>
        <h1>Home Page</h1>
        <Bar setSearched={setSearched} setProductInfo={setProductInfo}/> 
        <br/>
      </div>
        {searched ? <ListProduct products={product_info}/> : <Recommendation userid={userid}/>}
      
    </body>
  )
}

function Home(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Actual_home/>);
  }
};
 
export default Home;
