import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/product.css'

// this function loads photo from backend server
// input: productid
// output: image source
export function LoadProductPhoto(prop){
    const productid = prop.productid;
    const [isLoading, setLoading] = useState(true);

    // button redirects to specific product page 
    const navigate = useNavigate();
    var [viewproduct, setviewproduct] = useState(false);
    function gotoviewproduct(productid){
        setviewproduct(productid);
    }
    useEffect(() =>{
        if(!viewproduct) return;
        viewproduct = false;
        navigate(`/product/${productid}`);
    }, [viewproduct])

    // fetch image
    const [img, setImg] = useState('');
    useEffect(() => {
        const fetch_image = async() => {
            try{
                const res = await axios.get(`http://localhost:3030/product_img?id=${productid}`, {responseType: 'blob'})
                var imageUrl = URL.createObjectURL(res.data);
                setImg(imageUrl);
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_image();
    }, [])
    if(isLoading) return <p>Loading...</p> ;
    return (
        <div onClick={() => gotoviewproduct(true)} style={{cursor:'pointer'}}>
            <img src={img} className="product_img"/>
        </div>
    )
}


// this function returns the entities in entity_list of a product
// not for seller name, buyer name, category
// input: productid, entity_list, prefix
// output: page source of the required entity in order
export function LoadProduct(prop){
    const productid = prop.productid;
    const entity_list = prop.entities;
    const prefix_list = prop.prefix;
    const [isLoading, setLoading] = useState(true);
    // product price
    const [product, setproduct] = useState();
    useEffect(() => {
        const fetch_product = async() => {
            try{
                const res = await axios.get(`http://localhost:3030/product?productid=${productid}`)
                setproduct(res.data[0]);
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_product();
    }, [])
    // console.log(productid, product)
    if(isLoading) return <p>Loading...</p> ;
    else{
        var list = [];
        const L = Object.keys(entity_list).length; 
        for(var i=0;i<L;i++){
            if(entity_list[i] == 'category') {
                var l = product['category'].length;
                var output = '';
                for(var j=0;j<l;j++) {
                    output += product['category'][j];
                    if(j != l - 1) output += ', '
                }
            }
            list.push(<div className='dec'>{prefix_list[i]}{product[entity_list[i]]}</div>)
        }
        return list;
    }
}

// this function returns the category information of a product
// input: productid, prefix
// output: page source of the category in order
export function LoadProductCategory(prop){
    const productid = prop.productid;
    const [isLoading, setLoading] = useState(true);
    // product price
    const [category, setcategory] = useState();
    useEffect(() => {
        const fetch_product = async() => {
            try{
                const res = await axios.get(`http://localhost:3030/category?productid=${productid}`)
                setcategory(res.data)
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_product();
    }, [])
    if(isLoading) return <p>Loading...</p> ;
    else{
    // console.log(productid)
        var tmp = 'Category: ';
        const L = Object.keys(category).length; 
        for(var i=0;i<L;i++){
            var cur_category = category[i]['tag'];
            tmp = tmp + cur_category
            if(i != L-1) tmp = tmp + ', '
        }
        return <p>{tmp}</p>;
    }
}

export default LoadProductPhoto;