import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate, Navigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'


// const DeleteProduct

function FetchProductID(props){
    const userid = props.userid
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState([]);
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/seller_product?id=${userid}`) //fetch seller products product_id
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
            //console.log(cur['product_id']);
            list.push(
                <p>{cur['product_id']}:</p>)
            // list.push(<button onClick={EditProduct}>Edit Product</button>)
            // list.push(<button onClick={DeleteProduct}>Delete Product</button>)
            list.push(<p>name: {cur['product_name']}, price: {cur['price']}, quantity left: {cur['quantity']}, category: {cur['category']}</p>
            )   
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