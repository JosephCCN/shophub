import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import Reviews from "../review/reviews";
import {LoadProductPhoto, LoadProduct, LoadProductCategory} from "../util/product";
import {Username} from "../util/user";
import PageHeader from "../util/miss";
import "./css/specific-product.css";


function SpecificProduct() {
    const { productID } = useParams();
    var [back, setBack] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();
    var userid;
    
    const [isAdmin, setAdmin] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [sellerName, setSellerName] = useState('');
    const [product, setProduct] = useState();
    const [productimg, setProductImg] = useState('');
    const [productInfo, setProductInfo] = useState();
    const [edit, setEdit] = useState(false);
    var [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState('');
    const [productName, setProductName] = useState();
    const [productCat, setProductCat]= useState();
    const [description, setDescription] = useState();
    const [del, setDel] = useState(false);

    useEffect(() => {

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
            if(cookies.get('admin')) setAdmin(true);
            cookies.set('productid', productID, {
                path: '/'
            });
            const entities = ['price', 'quantity', 'product_id']
            const prefix = ['Price: $', 'Stock: ', 'Product ID: ']
            setProduct(<LoadProduct productid={productID} entities={entities} prefix={prefix}/>)
            setProductName(<LoadProduct productid={productID} entities={['product_name']} prefix={['']}/>)
            setDescription(<LoadProduct productid={productID} entities={['info']} prefix={['Description: ']}/>)
            setProductCat(<LoadProductCategory productid={productID}/>)
            setProductImg(<LoadProductPhoto productid={productID}/>)
            setSellerName(<Username userid={res.data[0]['seller_id']} prefix={['by']}/>)

            setProductInfo(res.data[0])
            setisLoading(false);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(back) {
            back = false;
            navigate('/home');
        }
    }, [back])

    useEffect(() => {
        if(!edit) return;
        navigate('/seller/edit_product')
    }, [edit])

    useEffect(() => {
        if(!del) return;
        const del_product = async() => {
            try{
                // const res1 = await axios.post('http://localhost:3030/delete_img',{
                    // 'productid': deleteproduct
                // })
                const res2 = await axios.post(`http://localhost:3030/delete_product`,{
                    'productid': productID
                })
                navigate(-1);
            }
            catch(err){
                console.log(err);
            }
        }
        del_product();
    }, [del])

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
        <body>
            <PageHeader/>
            <h1 className="product_header">Product</h1>
            <div className="specific_product">
                <div className="s_img">{productimg}</div>
                <div className="s_dec">
                    <p style={{'font-size': 25}}><b>{productName}</b></p>
                    <p>{sellerName}</p>
                    <p>{product}</p>
                    <p>{productCat}</p>
                    <label>Quantity:</label>
                    <button className="s_add1" onClick={handleQuantityDecrease}>-</button>
                    <input type='text' inputMode="numeric" onChange={handleQuantityChange} value={quantity}/>
                    <button className="s_add2" onClick={handleQuantityIncrease}>+</button>
                    <br/>
                    <br/>
                    <button className="s_fun" onClick={addToShoppingCart}>Add to Shopping Cart</button>
                    <button className="s_fun" onClick={addToWishlist}>Add to Wishlist</button>
                    {isAdmin ? <button className="s_fun" onClick={GoToEditProduct}>Edit Product</button> : <></>}
                    {isAdmin ? <button className="s_fun" onClick={() => {setDel(1)}}>Delete Product</button> : <></>}
                </div>
                <button className="s_fun" onClick={goBack}>Back to Main Page</button>
                <br/>
                <div className="specific_message">
                    <p>{msg}</p>
                </div>
            </div>
            <Reviews productID={productID}/>
        </body>
    )

}

export default SpecificProduct;