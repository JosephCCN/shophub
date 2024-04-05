// Importing Link from react-router-dom to 
// navigate to different end points.
import './css/Home.css';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import Bar from '../search-bar/bar'
import ListProduct from "../search-bar/list_product";

function Actual_home() {
  const [product_info, setProductInfo] = useState({});
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [logOut, setLogout] = useState(0);
  var [gotoSell, setGoToSell] = useState(0);

  const logout = () => {
    setLogout(1);
  };

  const GotoSell = () => {
    setGoToSell(1);
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

  useEffect(() => {
      if(!gotoSell) return;
      gotoSell = 0;
      navigate('/seller');
  }, [gotoSell])

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
                  <button>Wishlist</button>
                </li>
                <li>
                  <button>Shopping Cart</button>
                </li>
                <li>
                <button onClick={GotoSell}>Sell History</button>
                </li>
                <li>
                  <button>History</button>
                </li>
                <li>
                  <button>Profile</button>
                </li>
              </ul>
          </div>   
        </div>
      </nav>
      <div className='searching'>
        <h1>Home Page</h1>
        <Bar setProductInfo={setProductInfo}/> 
        <br/>
      </div>
        <ListProduct products={product_info}/>
      
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
