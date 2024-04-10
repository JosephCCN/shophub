// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link, useNavigate, useSearchParams, useRevalidator } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useEffect, useState } from "react";
import LoadProductPhoto from "../util/product";
import PageHeader from "../util/miss";
import "./css/cart.css";
import Username from "../util/user";
import '../util/css/back.css'

function CartProduct(props) {
  const cur = props.cur;
  const [product, setProduct] = useState('nth');
  const [cartQuantity, setCartQuantity] = useState(cur['quantity']);
  const cookies = new Cookies();
  const [removed, setRemoved] = useState(0);
  const [notEnough, setNotEnough] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3030/product?productid=${cur['product_id']}`)
    .then(res => {
      setProduct(res.data[0]);
      setTotalPrice(Number((res.data[0]['price'] * cur['quantity']).toFixed(1)))
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if(cartQuantity > product['quantity']) {
      setNotEnough(true);
    }
    else if(notEnough) setNotEnough(false);
  }, [product, cartQuantity])

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
    const prev = cartQuantity;
    if(t > product['quantity']) t = product['quantity'];
    else if(t < 0) t = 0;
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/edit_cart_quantity', {
      quantity: t,
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {
      setTotalPrice(Number((t * product['price']).toFixed(1)))
      props.TotalPriceChange(Math.random())
    })
    .catch(err => console.log(err))
    setCartQuantity(t);
}

  const handleQuantityIncrease = () => {
    if(cartQuantity + 1 <= product['quantity']) setCartQuantity(cartQuantity + 1);
    else return;
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/edit_cart_quantity', {
      quantity: cartQuantity + 1,
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {
      setTotalPrice(Number(((cartQuantity + 1) * product['price']).toFixed(1)))
      props.TotalPriceChange(Math.random())
    })
    .catch(err => console.log(err))
  }

  const handleQuantityDecrease = () => {
    if(cartQuantity - 1 > 0) setCartQuantity(cartQuantity - 1)
    else return
    const userid = cookies.get('userid');
    axios.post('http://localhost:3030/edit_cart_quantity', {
      quantity: cartQuantity - 1,
      userID: userid,
      productID: cur['product_id']
    })
    .then(res => {
      setTotalPrice(Number(((cartQuantity - 1) * product['price']).toFixed(1)))
      props.TotalPriceChange(Math.random())
    })
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
      props.TotalPriceChange(Math.random())
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
    <table className="product_table">
      <tr>
        <td className="left_col">
          <div className="cart_img">
            <LoadProductPhoto productid={cur['product_id']}/>
          </div>
        </td>
        <td className="mid_col">
          <div className="cart_info"> 
            <p><b>{product['product_name']}</b></p>
            <Username userid={product['seller_id']} prefix={['by']}/>
            <p><b>Unit Price: {product['price']}</b></p>
            <p><b>Stock: {product['quantity']}</b></p>
            {notEnough ? <font color='red'>There is NOT enough product for you</font>: <></>}
            {notEnough ? <br/>: <></>}
          </div>
          <div className="cart_select">
            <button className="cart_min_btn" onClick={handleQuantityDecrease}>-</button>
            <input className="cart_quantity_input" type='text' inputMode="numeric" onChange={handleQuantityChange} value={cartQuantity}/>
            <button className="cart_add_btn" onClick={handleQuantityIncrease}>+</button>
            <button className="cart_button1" onClick={handleRemove}>Remove from Cart</button>
            <br/>
            <button className="cart_button2" onClick={handleRemoveandAddtoWishlist}>Remove and Add to Wishlist</button>    
          </div>
        </td>
        <td className="right_col">
            <p><b>Subtotal: {totalPrice}</b></p>
        </td>
      </tr>
    </table>
    ,
    <p>Removed</p>
  ]

  const show = showList[removed]

  return (
    show
  )
}

function Cart(){
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  var [back, setBack] = useState(false);
  var [pay, setPayment] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceChange, TotalPriceChange] = useState(0);

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

  useEffect(() => {
    if(pay) {
      const userid = cookies.get('userid');
      pay = false;
      navigate(`/payment/${userid}`)
    }
  }, [pay]);

  useEffect(() => {
    const userid = cookies.get('userid');
    axios.get(`http://localhost:3030/cart_totalprice?userid=${userid}`)
    .then(res => setTotalPrice(res.data[0]['sum']))
    .catch(err => console.log(err))
  }, [totalPriceChange])

  const goBack = () => {
    setBack(true);
  }

  const payment = () => {
    setPayment(true);
  }


  if(cart == []) return <p>Loading...</p>
  var L = Object.keys(cart).length;

  if(L == 0) {
    return (
      <body>
      <PageHeader/>
      <div className="cart">
        <h1>Shopping Cart</h1>
        <p>You have no item in Cart!</p>
      < button className="cart_back" onClick={goBack}>Back</button>
      </div>
    </body>
    )
  }

  for(var i=0;i<L;i++) {
    const cur = cart[i];
    cartList.push(<CartProduct cur={cur} TotalPriceChange={TotalPriceChange}/>)
  }

  return (
    <div>
      <PageHeader/>
      <div className="cart">
        <h1>Shopping Cart</h1>

          {cartList}

          <table className="totalprice_table">
            <tr>
              <td className="left">
                <button className="back" onClick={goBack}>Back</button>
              </td>
              <td className="right">
                <div className="total_price">
                  <p><b>Total: {totalPrice}</b></p>
                </div>
                <button className="cart_pay" onClick={payment}>Payment</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
  )
  
};
 
export default Cart;
