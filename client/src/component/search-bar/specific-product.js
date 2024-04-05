import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { GetProduct, GetUserName, Get } from "../util/util";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie'



function SpecificProduct() {
    const [img, setImg] = useState('');
    const { productID } = useParams();
    var [back, setBack] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [ProductLoading, setProductLoading] = useState(true);
    const [product, setProduct] = useState([])
    const [sellerName, setSellName] = useState('');
    var [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState('');
    var userid;

    useEffect(() => {
        userid = cookies.get('userid');
        if(!userid) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3030/product?id=${productID}`)
        .then(res => {
            axios.get(`http://localhost:3030/username?id=${res.data[0]['seller_id']}`)
            .then(r => {
                setSellName(r.data[0]['username']);
            })
            setProduct(res.data[0]);
            setProductLoading(false);
        })

        axios.get(`http://localhost:3030/product_img?id=${productID}`, {responseType: 'blob'})
        .then(res => {
            var imageUrl = URL.createObjectURL(res.data);
            setImg(imageUrl);
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        if(back) {
            back = false;
            navigate(-1);
        }
    }, [back])

    /*useCallback(() => {
        if(!rmsg) return;
        setTimeout(() => {setMsg(''); rmsg=false}, 5000);
    }, [msg])*/

    const goBack = () => {
        setBack(true);
    }
    
    if(ProductLoading) return <p>Loading...</p>


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

    return (
        <div>
            <button onClick={goBack}>Back</button>
            <p>{product['info']}</p>
            <img src={img}/>
            <p>Sell by {sellerName}</p>
            <p>${product['price']}</p>
            <p>In Stock: {product['quantity']}</p>
            <label>Quantity</label>
            <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={quantity}/>
            <button onClick={() => {if(quantity < product['quantity']) setQuantity(quantity + 1)}}>Add</button>
            <button onClick={() => {if(quantity > 1) setQuantity(quantity - 1)}}>Delete</button><br/>
            <button onClick={addToShoppingCart}>Add to Shopping Cart</button>
            <p>{msg}</p>
        </div>
    )

}

export default SpecificProduct;