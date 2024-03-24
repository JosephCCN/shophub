// Importing Link from react-router-dom to 
// navigate to different end points.
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

  const logout = () => {
    setLogout(1);
  };

  useEffect(() => {
    if(!logOut) return
    cookies.remove('userid', {
      path: '/'
    });
    navigate('/login');
  }, [logOut])

  return (
    <div>
      <h1>ShopHub</h1>
      <Bar setProductInfo={setProductInfo}/> 
      <button onClick={logout}>Logout</button>
      <button>Seller</button>
      <br/>
      <ListProduct products={product_info}/>
    </div>
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
