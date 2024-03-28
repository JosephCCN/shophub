import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import History from '../history/history'
const seller_product = async(id) => {
    var response = await axios.get(`http://localhost:3030/seller_product?id=${id}`);
    return response.data;
}

function Seller(props) {
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    var result; 
    seller_product(userid)
    .then(res => {
        setlist(res)
        setLoading(false);
    });                //fetch seller products product_id
    if(isLoading) return <p>Loading...</p>;
    console.log(productlist);
    var list = []
    var L = Object.keys(productlist).length;
    console.log(productlist)
    for(var i=0;i<L;i++) {
        const cur = productlist[i];
        list.push(
            <p>{cur['product_id']}</p>
        )
    }
    return (
        <div>
            <h1>Seller Page</h1>
            <h1>Inventory:</h1>
            <h1>{list}</h1>
        </div>
    )
}

export default Seller;