import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

const seller_product = async(id) => {
    var response = await axios.get(`http://localhost:3030/seller_product?id=${id}`);
    return response.data;
}
function FetchProductID(props){
    const userid = props.userid;
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState();
    seller_product(userid)
    .then(res => {
        setlist(res)
        setLoading(false);
    });                //fetch seller products product_id
    if(isLoading) return <p>Loading...</p>;
    var list = []
    var L = Object.keys(productlist).length;
    for(var i=0;i<L;i++) {
        const cur = productlist[i];
        console.log(cur['product_id']);
        list.push(
            <p>{cur['product_id']}:</p>)
        list.push(<p>name: {cur['product_name']}, price: {cur['price']}</p>
        )
    }
    return list;
}
function Seller(props) {
    
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    
    return (
        <div>
            <h1>Seller Page</h1>
            <h1>Inventory:</h1>
            <FetchProductID userid={userid}/>
        </div>
    )
}

export default Seller;