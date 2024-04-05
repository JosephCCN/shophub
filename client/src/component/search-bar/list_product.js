import { useEffect, useState } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Product(prop) {
    const cur = prop.cur;
    const [img, setImg] = useState('');
    var [navi, setNavi] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(navi) {
            navigate(`/product/${cur['product_id']}`)
            navi = false
        }
    }, [navi])

    const select = (e) => { //execute when this product is clicked
        console.log(`navigate to ${cur['product_id']}`)
        setNavi(true)
    }

    const load_photo = () => { //load photo from backend server
        axios.get(`http://localhost:3030/product_img?id=${cur['product_id']}`, {responseType: 'blob'})
        .then(res => {
            var imageUrl = URL.createObjectURL(res.data);
            setImg(imageUrl);
        })
        .catch(err => {
            console.log(err);
        })
    }

    console.log(1)

    return (
        <div onClick={select} style={{cursor:'pointer'}}>
            {load_photo()}
            <img src={img}/>
            <p>{cur['product_name']}: ${cur['price']}</p>
        </div>
    );
}

function ListProduct(props) {
    const products = props.products;
    const L = Object.keys(products).length;
    let print_out = [];
    for(var i=0;i<L;i++) {
        const cur = products[i];
        print_out.push(
            <Product cur={cur}/>
        );
    }
    return (
        <div>
            <p>{print_out}</p>
        </div>
    )
}

export default ListProduct;