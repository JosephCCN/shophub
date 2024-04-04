import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'


function EditProduct(props) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    const productid = cookies.get('productid');
    if(!userid) navigate('/login');
    if(!productid) navigate('/seller');
    const [isLoading, setLoading] = useState(true);
    const [product, setproduct] = useState([]);


    const [productname, setproductname] = useState();
    const [productinfo, setproductinfo] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [category, setcategory] = useState();
    const [image, setImage] = useState();
    const [err, setErr] = useState();


    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/product?productid=${productid}`) //fetch product with productid
            setproduct(res.data)
            setLoading(false)
        }
        fetch();
    }, [])
    if(isLoading) {
        return <p>Loading...</p>
    }

    
    const handleeditproduct = (e) => {
        axios.post('http://localhost:3030/edit_product', {
            productid: productid,
            productname: productname,
            productinfo: productinfo,
            price: price,
            quantity: quantity,
            category: category,
        })
        .then(res =>{
            if(res.data['err']) {
                setErr(res.data['err'])    //set error msg
                return //cannot update product, thus return
            }
            navigate('/seller')
        })
        .catch(err =>{
            console.log(err);
        })
    }
    return (
        <div>
            <h1>Edit Product Page</h1>
            <center>
            <table>
                <tr>
                    <td><label>Product Name:</label></td>
                    <td><label>{product[0]['product_name']}</label></td>
                    <td><input type="text" onChange={(e) => setproductname(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label>Product Info:</label></td>
                    <td><label>{product[0]['info']}</label></td>
                    <td><input type="text" onChange={(e) => setproductinfo(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label>Category:</label></td>
                    <td><label>{product[0]['category']}</label></td>
                    <td><input type="text" onChange={(e) => setcategory(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label>Quantity:</label></td>
                    <td><label>{product[0]['quantity']}</label></td>
                    <td><input type="text" onChange={(e) => setquantity(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label>Price:</label></td>
                    <td><label>{product[0]['price']}</label></td>
                    <td><input type="text" onChange={(e) => setprice(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label>Producat Image:</label></td>
                    <td><input onChange={(e)=>{setImage(e.target.files[0])}} name="image" type="file"></input></td>
                </tr>
            </table>
            </center>
            <button type="submit" onClick={handleeditproduct}> Edit Product</button>
        </div>
    )
    
}

export default EditProduct;