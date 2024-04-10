import axios from 'axios'
import { SearchBar } from '../util/search';
import ListProduct from './list_product';
import ShowNotifcation from '../wishlist/notification';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHeader from '../util/miss';
import Cookies from 'universal-cookie'

export function SS() {
    const {key} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/search/${key}`)
    }, [])
}

export function ADV() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/adv_search`)
    }, [])
}

export function Search() {
    const {key} = useParams();
    const [products, setProduct] = useState([]); 
    const [searched, setSearched] = useState(false);
    const cookies = new Cookies;
    const navigate = useNavigate();
    var userid = cookies.get('userid');
    
    console.log(key)

    useEffect(() => {
 
        if(!userid) {
            navigate('/login');
        }

        axios(`http://localhost:3030/search?key=${key}`)
        .then((res) => {
            setProduct(res.data);
            setSearched(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])
    

    if(!searched) return <p>Loading...</p>
    console.log(products)

    return (
        <body>  
            <PageHeader/>
            <SearchBar advance={false}/>
            <ListProduct products={products}/>
            <div className='notice'>
                <p>Notification</p>
                <ShowNotifcation userid={userid}/>
            </div> 
        </body>
    )
}

export function AdvSearch() {
    const [products, setProduct] = useState(0);
    const [searched, setSearched] = useState(false);
    const cookies = new Cookies;
    const navigate = useNavigate();
    var userid = cookies.get('userid');

    useEffect(() => {

        if(!userid) {
            navigate('/login');
        }

        const selectedOptions = cookies.get('categories');
        const lower = cookies.get('lower')
        const upper = cookies.get('upper')
        const key = cookies.get('key')

        axios.post(`http://localhost:3030/adv_search`, {
            categories: selectedOptions,
            lower: lower,
            upper: upper,
            key: key
        })
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            setProduct(res.data);
            setSearched(true);
        })
        .catch(err => console.log(err))
    }, [])

    if(!searched) return <p>Loading...</p>

    return (
        <body>
            <PageHeader/>
            <SearchBar advance={true}/>
            <ListProduct products={products}/>
            <div className='notice'>
                <p>Notification</p>
                <ShowNotifcation userid={userid}/>
            </div> 
        </body>
    )
}
