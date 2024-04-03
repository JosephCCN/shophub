// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import axios from 'axios'
import {Get} from '../util/util'

function ShowUser(props) {
  return <p>{props.userid}: {props.username}</p>
}

function ShowProduct(props) {

  const fetchUserName = (id) => {
    var {data, isLoading} = Get(`http://localhost:3030/username?id=${id}`);
    if(isLoading) return 'loading';
    else return data[0]['username']
  }

  const name = fetchUserName(1);
  return <p>{props.productID}: selling by {name} {props.productName} ${props.price}</p>
}

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
    list.push(<ShowUser userid={'User ID'} username={'Username'}/>)
    for(var i=0;i<L;i++) {
      const cur = users[i]
      list.push(<ShowUser userid={cur['user_id']} username={cur['username']}/>)
    }
    return list
  }
}

function FetchAllProduct() {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async() => {
      const result = await axios('http://localhost:3030/all_products');
      setUsers(result.data);
      setLoading(false);
    }
    fetch();
  }, [])
  
  if(isLoading) return <p>Loading...</p>
  else {
    const L = Object.keys(users).length;
    var list = []
    //list.push(<ShowProduct userid={'Product ID'} username={'Product Name'}/>)
    for(var i=0;i<L;i++) {
      const cur = users[i]
      list.push(<ShowProduct productID={cur['product_id']} productName={cur['product_name']} price={cur['price']} sellerID={cur['seller_id']}/>)
    }
    return list
  }
}

function Actual_admin() {
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
    cookies.remove('admin', {
      path: '/'
    });
    navigate('/login');
  }, [logOut])


  return (
    <div>
      <h1>Real Admin</h1>
      <button onClick={logout}>logout</button>
      <h1>User</h1>
      <FetchAllUser/>
      <h1>Product</h1>
      <FetchAllProduct/>
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
