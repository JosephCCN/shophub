import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import beforeImage from '../../image/image.png';


function AddProduct(props) {
    const cookies = new Cookies();
    const userid = cookies.get('userid');
    const [productname, setproductname] = useState();
    const [productinfo, setproductinfo] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [category, setcategory] = useState();
    const [image, setImage] = useState();
    const [err, setErr] = useState();

    const handleaddproduct = (e) => {
        axios.post('http://localhost:3030/add_product', {
            userid: userid,
            productname: productname,
            productinfo: productinfo,
            price: price,
            quantity: quantity,
            category: category,
        })
        .then(res =>{
            if(res.data['err']) {
                setErr(res.data['err'])    //set error msg
                return //cannot login, thus return
            }
            console.log('added')
            return <p>added successfully</p>
        })
        .catch(err =>{
            console.log(err);
        })
    }

    if(!userid) {
        return (<Navigate to='/login'/>);
    }
    else {
        return (
            <div>
                <h1>Add Product Page</h1>
                <label>Product Name:</label><input type="text" onChange={(e) => setproductname(e.target.value)}/>
                <br/>
                <label>Product Info:</label><input type="text" onChange={(e) => setproductinfo(e.target.value)}/>
                <br/>
                <label>Category:</label><input type="text" onChange={(e) => setcategory(e.target.value)}/>
                <br/>
                <label>Quantity:</label><input type="text" onChange={(e) => setquantity(e.target.value)}/>
                <br/>
                <label>Price:</label><input type="text" onChange={(e) => setprice(e.target.value)}/>
                <br/>
                <label>Producat Image:</label><input onChange={(e)=>{setImage(e.target.files[0])}} name="image" type="file"></input>
                <br/>
                <button type="submit" onClick={handleaddproduct}> Add Product</button>
            </div>
        )
    }
    
}

export default AddProduct;