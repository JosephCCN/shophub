import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate, Navigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {LoadProductPhoto} from '../util/product'

function FetchProductID(props){
    const userid = props.userid
    const [isLoading, setLoading] = useState(true);
    const [err, setErr] = useState();
    const [productlist, setlist] = useState([]);
    var [deleteproduct, setdeleteproduct] = useState(0);
    function gotodeleteproduct(productid){
        setdeleteproduct(productid);
    }
    // delete product from seller       deleteproduct = productid
    useEffect(() => {
        if(!deleteproduct) return;
        const del_product = async() => {
            try{
                const res1 = await axios.post('http://localhost:3030/delete_img',{
                    'productid': deleteproduct
                })
                const res2 = await axios.post(`http://localhost:3030/delete_product`,{
                    'productid': deleteproduct
                })
                setLoading(false)
                window.location.reload(false);
            }
            catch(err){
                setErr(err);
                console.log(err);
            }
        }
        del_product();
    }, [deleteproduct])
    const cookies = new Cookies();
    const navigate = useNavigate();
    var [editproduct, seteditproduct] = useState(0);
    function gotoeditproduct(productid){
        seteditproduct(productid);
    }
    useEffect(() =>{                            //set productid to cookies and go to edit_product page
        if(!editproduct) return;
        cookies.set('productid', editproduct, {  //set cookies
        path: '/'
        });
        navigate('/seller/edit_product');
    }, [editproduct])
    

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/seller_product?id=${userid}&asc=1`) //fetch seller products product_id
            setlist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])
    if(isLoading) {
        return <p>Loading...</p>
    }
    else {
        var list = []
        var L = Object.keys(productlist).length;
        for(var i=0;i<L;i++) {
            const cur = productlist[i];
            const productid = cur['product_id']
            list.push(
                <p>{cur['product_id']}:</p>)
            list.push(<p>name: {cur['product_name']}, price: {cur['price']}, quantity left: {cur['quantity']}, category: {cur['category']}</p>)   
            list.push(<LoadProductPhoto productid={productid}/>)
            list.push(<button onClick={() => gotoeditproduct(productid)}>Edit Product</button>)
            list.push(<button onClick={() => gotodeleteproduct(productid)}>Delete Product</button>)
        }
        return list
    }
    
}

function FetchHistory(props){
    const userid = props.userid
    const top = props.top
    const [isLoading, setLoading] = useState(true);
    const [historylist, setlist] = useState([]);
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/seller_history?id=${userid}&top=${top}`) //fetch seller history
            setlist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])
    if(isLoading) {
        return <p>Loading...</p>
    }
    else {
        var list = []
        var L = Object.keys(historylist).length;
        if(L == 0){
            return <p>No History</p>;
        }
        list.push(<h1>Sales History:</h1>)
        for(var i=0;i<L;i++) {
            const cur = historylist[i];
            //console.log(cur['product_id']);
            list.push(
                <p>{cur['product_id']}:</p>)
            list.push(<p>buyer: {cur['buyer_id']}, price: {cur['price']}, order date: {cur['order_date']}, quantity: {cur['quantity']}, price:{cur['price']}</p>
            )   
        }
        return list
    }
    
}

function Seller(props) {
    
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    const top = 10
    var [AddProduct, setAddProduct] = useState(0);
    const GoToAddProduct = () =>{
        setAddProduct(1);
    }
    useEffect(() => {
      if(!AddProduct) return;
      AddProduct = 0;
      navigate('/seller/add_product');
    }, [AddProduct])
    
    return (
        <div>
            <h1>Seller Page</h1>
            <h1>Inventory:</h1>
            <button onClick={GoToAddProduct}>Add Product</button>
            <FetchProductID userid={userid}/>
            <FetchHistory userid={userid} top={top}/>
        </div>
    )
}

export default Seller;