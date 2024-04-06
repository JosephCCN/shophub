import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// this function loads photo from backend server
// input: productid
// output: image source
export function LoadProductPhoto(prop){
    const productid = prop.productid;
    const [isLoading, setLoading] = useState(true);
    console.log('adsf')

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
            <img src={img}/>
        </div>
    )
}


// this function returns the entities in entity_list of a product
// not for seller name, buyer name
// input: productid, entity_list, prefix
// output: page source of the required entity in order
export function LoadProduct(prop){
    const productid = prop.productid;
    const entity_list = prop.entities;
    const prefix_list = prop.prefix;
    console.log(productid, entity_list, prefix_list)
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
    if(isLoading) return <p>Loading...</p> ;
    else{
        var list = [];
        const L = Object.keys(entity_list).length; 
        for(var i=0;i<L;i++){
            list.push(<p>{prefix_list[i]}{product[entity_list[i]]}</p>)
        }
        return list;
    }
}


export default LoadProductPhoto;