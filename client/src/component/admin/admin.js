// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import axios from 'axios'
import Username from "../util/user";
import HomeHeader from "../util/miss";
import './css/admin.css'
import ListProduct from "../search-bar/list_product";

function FetchAllUser() {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async() => {
      const result = await axios('http://localhost:3030/all_users');
      setUsers(result.data);
      setLoading(false);
    }
    fetch();
  }, [])
  
  if(isLoading) return <p>Loading...</p>
  else {
    const L = Object.keys(users).length;
    var list = []
    for(var i=0;i<L;i++) {
      const cur = users[i]
      list.push(
        <div className="user_list">
          <Username userid={cur['user_id']}/>
        </div>
        
      )
    }
    return (
      <div className="user_result">
        {list}
      </div>
    )
  }
}

function FetchAllProduct() {
  const [isLoading, setLoading] = useState(true);
  const [products, setproducts] = useState([]);

  useEffect(() => {
    const fetch = async() => {
      const result = await axios('http://localhost:3030/all_products');
      setproducts(result.data);
      setLoading(false);
    }
    fetch();
  }, [])
  
  if(isLoading) return <p>Loading...</p>
  else {
    return <ListProduct products={products}/>
  }
}

function Actual_admin() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [logOut, setLogout] = useState(0);
  const [showAllUser, setShowAllUser] = useState(true);

  const logout = () => {
    setLogout(1);
  };
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


  return (
    <div>
      <HomeHeader/>
      <h1>Admin Page</h1>
      <table className="table">
        <tr>
          <td>
          <div>
            {showAllUser ? <button onClick={() => {setShowAllUser(false)}} className="toggle_btn">Show All Product</button> : <button onClick={() => {setShowAllUser(true)}} className="toggle_btn">Show All User</button>}
          </div>
          </td>
        </tr>
        <tr>
          <td>
            {showAllUser ? <h2>Users</h2> : <h2>Products</h2>}
          </td>
        </tr>
        <tr>
          <td>
            {showAllUser ? <FetchAllUser/> : <></>}
          </td>
        </tr>
      </table>
      {showAllUser ? <></> : <FetchAllProduct/>}
    </div>
  )
}

function Admin(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  const admin = cookies.get('admin');
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else if(!admin) {
    return (<Navigate to='/home'/>);
  }
  else {
    return(<Actual_admin/>);
  }
};
 
export default Admin;
