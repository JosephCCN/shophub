import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import Reviews from "../review/reviews";
import {LoadProductPhoto, LoadProduct} from "../util/product";
import {Username} from "../util/user";


function SpecificProduct() {
    const { productID } = useParams();
    var [back, setBack] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();
    var [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState('');
    var userid;

    useEffect(() => {
        userid = cookies.get('userid');
        if(!userid) {
            navigate('/login')
        }
    }, [])
    const [isLoading, setisLoading] = useState(true);
    const [sellerName, setSellerName] = useState('');
    const [product, setProduct] = useState([]);
    const [productimg, setProductImg] = useState('');
    useEffect(() => {
        const fetch_product = async() => {
            try{
                const entities = ['price', 'quantity']
                const prefix = ['$', 'In Stock']
                setProduct(<LoadProduct productid={productID} entities={entities} prefix={prefix}/>)
                setProductImg(<LoadProductPhoto productid={productID}/>)
                setSellerName(<Username userid={userid} prefix={['Sold by ']}/>)
                setisLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_product();
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
    
    if(isLoading) return <p>Loading...</p>


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
        setQuantity(t);
    }

    const addToShoppingCart = () => {
        userid = cookies.get('userid');
        axios.post('http://localhost:3030/add_cart', {
            productID: productID,
            userID: userid,
            quantity: quantity
        })
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            else if(res.data['in_cart']) {
                setMsg('Item already in Shopping Cart')
            }
            else{
                setMsg('Added to Shopping Cart');
            }
        })
        .catch(err => console.log('error', err))
    }

    const addToWishlist = () => {
        userid = cookies.get('userid');
        axios.post('http://localhost:3030/add_to_wishlist', {
            productid: productID,
            userid: userid
        })
        .then(res => {
            if(res.data['err']){
                console.log(res.data['err']);
                return;
            }
            else if(res.data['in_wishlist']) {
                setMsg('Item already in Wishlist')
            }
            else{
                setMsg('Added to Wishlist');
            }
        })
        .catch(err => console.log('error', err))
    }

    return (
        <div>
            <button onClick={goBack}>Back</button>
            <p>{product['info']}</p>
            {productimg}
            {sellerName}
            {product}
            <label>Quantity</label>
            <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={quantity}/>
            <button onClick={() => {if(quantity < product['quantity']) setQuantity(quantity + 1)}}>Add</button>
            <button onClick={() => {if(quantity > 1) setQuantity(quantity - 1)}}>Delete</button><br/>
            <button onClick={addToShoppingCart}>Add to Shopping Cart</button>
            <button onClick={addToWishlist}>Add to Wishlist</button>
            <p>{msg}</p>
            <Reviews productID={productID}/>
        </div>
    )

}

export default SpecificProduct;