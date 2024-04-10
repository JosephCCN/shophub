import { useEffect, useState } from "react";
import axios from 'axios'
import ListProduct from "../search-bar/list_product";

function Recommendation(props) {
    const userid = props.userid;
    var limit = 50;

    const [products, setProducts] = useState('nth');

    useEffect(() => {
        axios.get(`http://localhost:3030/recommendation?limit=${limit}&userid=${userid}`)
        .then(res => {
            setProducts(res.data);
        })
        .catch(err => console.log(err));
    }, [])

    if(products == 'nth') return <p>Loading...</p>
    if(products.length == 0) return <p>No Product</p>


    return (
        <div>
            <h1>These seems suit you the most</h1>
            <ListProduct products={products}/>
        </div>
    )
}

export default Recommendation;