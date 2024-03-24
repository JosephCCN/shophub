import { useState } from "react";
import axios from 'axios'

function Product(prop) {
    const cur = prop.cur;
    const [img, setImg] = useState('');

    const select = (e) => { //execute when this product is clicked
        console.log('clicked')
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

    return (
        <div onClick={select} style={{cursor:'pointer'}}>
            {load_photo()}
            <img src={img}/>
            <p>{cur['product_name']}: ${cur['price']}</p>
        </div>
    );
}

function ListProduct(props) {
    const [search_key, setSearchKey] = useState();
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