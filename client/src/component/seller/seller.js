import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function FetchProductID(userid, setProducts){
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState([]);
    axios.get(`http://localhost:3030/seller_product?id=${userid}`) //fetch seller products product_id
    .then(res => {
        setlist(res.data)
        setLoading(false)
    })
    useEffect(() => {
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
        setProducts(() => {return list})
    }, [isLoading])
}
function Seller(props) {
    
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    const [products, setProducts] = useState(() => {return <p>Loading...</p>})
    
    return (
        <div>
            <h1>Seller Page</h1>
            <h1>Inventory:</h1>
            {FetchProductID(userid, setProducts)}
            {products}
        </div>
    )
}

export default Seller;