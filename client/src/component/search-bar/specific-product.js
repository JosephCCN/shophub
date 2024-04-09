import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import Reviews from "../review/reviews";
import {LoadProductPhoto, LoadProduct, LoadProductCategory} from "../util/product";
import {Username} from "../util/user";
import "./css/specific-product.css";


function SpecificProduct() {
    const { productID } = useParams();
    var [back, setBack] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();
    var userid;
    var isAdmin = false;

    const [isLoading, setisLoading] = useState(true);
    const [sellerName, setSellerName] = useState('');
    const [product, setProduct] = useState([]);
    const [productimg, setProductImg] = useState('');
    const [productInfo, setProductInfo] = useState();
    const [edit, setEdit] = useState(false);
    var [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState('');
    const [productCat, setProductCat] = useState();
    const [cat, setCat] = useState();

    useEffect(() => {

        const fetch_product = async() => {
            try{
                const entities = ['price', 'quantity']
                const prefix = ['Price: HKD$', 'In Stock: ']
                setProduct(<LoadProduct productid={productID} entities={entities} prefix={prefix}/>)
                setProductImg(<LoadProductPhoto productid={productID}/>)
                setSellerName(<Username userid={userid} prefix={['Seller: ']}/>)
                setisLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }

        userid = cookies.get('userid');
        if(!userid) {
            navigate('/login')
        }

        axios.get(`http://localhost:3030/product?productid=${productID}`)
        .then(res => {
            if(res.data.length == 0) {
                navigate('/home');
            }
            userid = cookies.get('userid');
            if(!userid) {
                navigate('/login')
            }
            if(cookies.get('admin')) isAdmin = true;
            cookies.set('productid', productID, {
                path: '/'
            });
            const entities = ['price', 'quantity']
            const prefix = ['$', 'In Stock: ']
            setProduct(<LoadProduct productid={productID} entities={entities} prefix={prefix}/>)
            setCat(<LoadProduct productid={productID} entities={['info']} prefix={['Description: ']}/>)
            setProductImg(<LoadProductPhoto productid={productID}/>)
            setProductCat(<LoadProductCategory productid={productID}/>)
            setSellerName(<Username userid={res.data[0]['seller_id']} prefix={['Sold by ']}/>)
            setProductInfo(res.data[0])
            setisLoading(false);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(back) {
            back = false;
            navigate(-1);
        }
    }, [back])

    useEffect(() => {
        if(!edit) return;
        navigate('/seller/edit_product')
    }, [edit])

    if(isLoading) return <p>Loading...</p>

    const goBack = () => {
        setBack(true);
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

    const GoToEditProduct = () => {
        setEdit(true);
    }

    const handleQuantityIncrease = () => {
        if(quantity + 1 <= productInfo['quantity']) setQuantity(quantity + 1);
        else return;
    }
    
    const handleQuantityDecrease = () => {
        if(quantity - 1 > 0) setQuantity(quantity - 1)
        else return
    }

    const handleQuantityChange = (e) => {
        var t = e.target.value
        for(var i=0;i<t.length;i++) {
            if(!('0' <= t[i] && t[i] <= '9')) {
                return;
            }
        }
        if(t < 0 || t > productInfo['quantity']){
            return
        }
        setQuantity(t);
    }
    

    return (
        <div className="specific_product">
            <p>{product['info']}</p>
            {productimg}
            {sellerName}
            {product}
            {productCat}
            <button onClick={handleQuantityDecrease}>-</button>
            <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={quantity}/>
            <button onClick={handleQuantityIncrease}>+</button>
            <br/>
            <button onClick={addToShoppingCart}>Add to Shopping Cart</button>
            <button onClick={addToWishlist}>Add to Wishlist</button>
            {isAdmin ? <button onClick={GoToEditProduct}>Edit Product</button> : <></>}
            <p>{msg}</p>
            {cat}
            <Reviews productID={productID}/>
            <div className="s_img">{productimg}</div>
            <div className="s_dec">
                <p>{sellerName}</p>
                <p>{product}</p>
                <label>Quantity:</label>
                <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={quantity}/>
                <br/>
                <br/>
                <button className="s_add" onClick={() => {if(quantity < product['quantity']) setQuantity(quantity + 1)}}>Add</button>
                <button className="s_add" onClick={() => {if(quantity > 1) setQuantity(quantity - 1)}}>Delete</button>
                <br/>
                <br/>
                <button className="s_fun" onClick={addToShoppingCart}>Add to Shopping Cart</button>
                <button className="s_fun" onClick={addToWishlist}>Add to Wishlist</button>
                <button className="s_fun" onClick={goBack}>Back to Main Page</button>
            </div>
            <br/>
            <div className="specific_message">
                <p>{msg}</p>
            </div>
            <div className="spec_review">
                <Reviews productID={productID}/>
            </div>
        </div>
    )

}

export default SpecificProduct;