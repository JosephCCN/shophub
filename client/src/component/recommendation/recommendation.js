import { Axios } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { LoadProduct } from "../util/product";
import ListProduct from "../search-bar/list_product";

function Recommendation(props) {
    const userid = props.userid;
    var limit = 5;

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