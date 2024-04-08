import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
var FormData = require('form-data')

function AddProduct(props) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');

    const [productname, setproductname] = useState();
    const [productinfo, setproductinfo] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [category, setcategory] = useState();
    const [image, setImage] = useState();
    const [err, setErr] = useState();
    const handleaddproduct = async(e) => {
        try{
            //fetch maximum productid
            const res1 = await axios.get(`http://localhost:3030/maxproductid`)
            console.log(res1)
            const nextproductid = parseInt(res1.data[0]['last_value'], 10) + 1

            //add image
            const dataform = new FormData();
            dataform.append('userid', userid);
            dataform.append('productname', productname);
            dataform.append('productinfo', productinfo);
            dataform.append('price', price);
            dataform.append('quantity', quantity);
            dataform.append('category', category);
            dataform.append('productid', nextproductid);
            dataform.append('image', image);
            const res2 = await axios.post('http://localhost:3030/add_product', dataform)
            //go back to seller page
            navigate('/seller');
        }
        catch(err){
            setErr(err)
            console.log(err)
        }      
    }
    return (
        <div>
            <h1>Add Product Page</h1>
            <label>Product Name:</label><input type="text" onChange={(e) => setproductname(e.target.value)}/>
            <br/>
            <label>Product Info:</label><input type="text" onChange={(e) => setproductinfo(e.target.value)}/>
            <br/>
            <label>Quantity:</label><input type="text" onChange={(e) => setquantity(e.target.value)}/>
            <br/>
            <label>Price:</label><input type="text" onChange={(e) => setprice(e.target.value)}/>
            <br/>
            <label>Category:</label><input type="text" onChange={(e) => setcategory(e.target.value)}/>
            <br/>
            <label>Producat Image:</label><input onChange={(e)=>{setImage(e.target.files[0])}} name="product_image" type="file"></input>
            <br/>
            <button type="submit" onClick={handleaddproduct}> Add Product</button>
        </div>
    )
    
}

export default AddProduct;