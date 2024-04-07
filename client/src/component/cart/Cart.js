// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link, useNavigate, useSearchParams, useRevalidator } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useEffect, useState } from "react";
import LoadProductPhoto from "../util/product";

function CartProduct(props) {
  const cur = props.cur;
  const [product, setProduct] = useState('nth');
  const [img, setImg] = useState('');
  const [cartQuantity, setCartQuantity] = useState(cur['quantity']);
  const cookies = new Cookies();
  const [removed, setRemoved] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3030/product?productid=${cur['product_id']}`)
    .then(res => {
      setProduct(res.data[0]);
    })
    .catch(err => console.log(err))
  }, [])

  const handleQuantityChange = (e) => {
    var t = e.target.value
    for(var i=0;i<t.length;i++) {
        if(!('0' <= t[i] && t[i] <= '9')) {
            return;
        }
    }
    if(t < 0 || t > product['quantity']){
        return
    }
    setCartQuantity(t);
}

  const handleQuantityIncrease = () => {
    if(cartQuantity < product['quantity']) setCartQuantity(cartQuantity + 1);
    else return;
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/edit_cart_quantity', {
      quantity: cartQuantity + 1,
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {})
    .catch(err => console.log(err))
  }

  const handleQuantityDecrease = () => {
    if(cartQuantity > 1) setCartQuantity(cartQuantity - 1)
    else return
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/edit_cart_quantity', {
      quantity: cartQuantity - 1,
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {})
    .catch(err => console.log(err))
  }

  const handleRemove = () => {
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/delete_cart', {
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {
      if(res.data['err']) {
        console.log(res.data['err']);
        return;
      }
      setRemoved(1);
    })
    .catch(err => console.log(err))
  }

  const handleRemoveandAddtoWishlist = () => {
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/add_to_wishlist', {
      userid: userid,
      productid: cur['product_id']
    })
    .then(res => {
      if(res.data['err']) {
        console.log(res.data['err']);
        return;
      }
    })
    .catch(err => console.log(err))
    handleRemove();
  }

  if(product == 'nth') return <p>Loading...</p>


  const showList = [
    <div>
      <p>ID: {cur['product_id']}</p>
      <LoadProductPhoto productid={cur['product_id']}/>
      <p>Name: {product['product_name']}</p>
      <p>Price: {product['price']}</p>
      <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={cartQuantity}/>
      <button onClick={handleQuantityIncrease}>Add</button>
      <button onClick={handleQuantityDecrease}>Delete</button><br/>
      <button onClick={handleRemove}>Remove from Cart</button>
      <button onClick={handleRemoveandAddtoWishlist}>Remove and Add to Wishlist</button>
    </div>
    ,
    <p>Removed</p>
  ]

  const show = showList[removed]

  return (
    <div>
      <p>{show}</p>
    </div>
  )
}

function Cart(){
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  var [back, setBack] = useState(false);

  useEffect(() => {
    const userid = cookies.get('userid');
    if(!userid) {
      navigate('/login');
    }
  }, []);

  var cartList = []

  useEffect(() => {
    const userid = cookies.get('userid');
    axios.get(`http://localhost:3030/cart?id=${userid}`)
    .then(res => {
      setCart(res.data);
    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if(back) {
        back = false;
        navigate(-1);
    }
  }, [back])

  const goBack = () => {
    setBack(true);
  }


  if(cart == []) return <p>Loading...</p>
  var L = Object.keys(cart).length;

  if(L == 0) {
    return (
      <div>
      <button onClick={goBack}>Back</button>
      <h1>Shopping Cart</h1>
      <p>You have no item in Cart!</p>
    </div>
    )
  }

  for(var i=0;i<L;i++) {
    const cur = cart[i];
    cartList.push(<CartProduct cur={cur}/>)
  }

  return (
    <div>
      <button onClick={goBack}>Back</button>
      <h1>Shopping Cart</h1>
      {cartList}
    </div>
  )
  
};
 
export default Cart;
