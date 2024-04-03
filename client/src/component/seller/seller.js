import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function FetchProductID(props){
    const userid = props.userid
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState([]);
    axios.get(`http://localhost:3030/seller_product?id=${userid}`) //fetch seller products product_id
    .then(res => {
        setlist(res.data)
        setLoading(false)
    })
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
            list.push(<p>name: {cur['product_name']}, price: {cur['price']}</p>
            )   
        }
        return list
    }
    
}


function Test(props) {
    const userid = props.userid
    const [productlist, setlist] = useState([]);
    const [loading, setLoading] = useState(true);
    axios.get(`http://localhost:3030/seller_product?id=${userid}`) //fetch seller products product_id
    .then(res => {
        setlist(res.data)
        setLoading(false)
    })
    if (loading) {
        return <p>Loading...</p>
    }
    else {
        return <p>Loaded</p>
    }
}

function Seller(props) {
    
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    const [products, setProducts] = useState(() => {return <p>Loading...</p>})
    //var list = FetchProductID(userid)
    console.log(1)
    
    return (
        <div>
            <h1>Seller Page</h1>
            <h1>Inventory:</h1>
            {/* {FetchProductID(userid, setProducts)} */}
            <FetchProductID userid={userid}/>
        </div>
    )
}

export default Seller;