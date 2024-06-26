import { useEffect, useInsertionEffect, useState } from "react"
import {useNavigate, Navigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {LoadProductCategory, LoadProductPhoto} from '../util/product'
import {ShowSalesHistory} from '../history/history'
import PageHeader from '../util/miss'
import './css/seller.css'
import DeleteIcon from './css/delete_icon.png'
import EditIcon from './css/edit_icon.png'

function ProductInfoSource(prop){
    const cur_product = prop.cur_product
    // console.log(cur_product)
    const [err, setErr] = useState('');
    //delete product
    var [deleteproduct, setdeleteproduct] = useState(0);
    var [deleted, setdeleted] = useState(0);
    function gotodeleteproduct(productid){
        setdeleteproduct(productid);
    }
    // delete product from seller       deleteproduct = productid
    useEffect(() => {
        if(!deleteproduct) return;
        const del_product = async() => {
            try{
                // const res1 = await axios.post('/delete_img',{
                    // 'productid': deleteproduct
                // })
                const res2 = await axios.post(`/delete_product`,{
                    'productid': deleteproduct
                })
                setdeleted(1)
            }
            catch(err){
                setErr(err);
                console.log(err);
            }
        }
        del_product();
    }, [deleteproduct])

    //edit product button
    const cookies = new Cookies();
    const navigate = useNavigate();
    var [editproduct, seteditproduct] = useState(0);
    function gotoeditproduct(productid){
        seteditproduct(productid);
    }
    useEffect(() =>{                            //set productid to cookies and go to edit_product page
        if(!editproduct) return;
        cookies.set('productid', editproduct, {  //set cookies
        path: '/'
        });
        navigate('/seller/edit_product');
    }, [editproduct])
    
    const productid = cur_product['product_id']
    var list = []
    /*list.push(<p>{cur_product['product_id']}:</p>)*/
    list.push(<LoadProductPhoto productid={productid} className='product_img'/>)
    list.push(<p>Name: {cur_product['product_name']} <br/> Price: ${cur_product['price']} <br/> Stock: {cur_product['quantity']}</p>)
    /*list.push(<LoadProductCategory productid={productid}/>)*/
    list.push(<img src={EditIcon} className='icon' onClick={() => gotoeditproduct(productid)}/>)
    list.push(<img src={DeleteIcon} className='icon' onClick={() => gotodeleteproduct(productid)}/>)
    const show_product=[<div className="seller_content">{list}</div>, <p></p>]
    // if deleted = 0, show product
    // if deleted = 1, hide product
    return show_product[deleted]
}
function ShowSellerProduct(props){
    const userid = props.userid
    const [isLoading, setLoading] = useState(true);
    const [productlist, setlist] = useState([]);
    
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/seller_product?id=${userid}&asc=1`) //fetch seller products product_id
            setlist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])
    if(isLoading) {
        return <p>Loading...</p>
    }
    else {
        var list = []
        var L = Object.keys(productlist).length;
        if(L === 0) list.push(<p>No Product Selling! Click Add Product button to add product for sale!!</p>)
        for(var i=0;i<L;i++) {
            const cur = productlist[i];
            list.push(<ProductInfoSource cur_product={cur}/>)
        }
        return list
    }
    
}

function Seller(props) {
    
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    const top = 10
    var [AddProduct, setAddProduct] = useState(0);
    const GoToAddProduct = () =>{
        setAddProduct(1);
    }
    useEffect(() => {
      if(!AddProduct) return;
      AddProduct = 0;
      navigate('/seller/add_product');
    }, [AddProduct])

    // go back
    var [back, setBack] = useState(false);
    useEffect(() => {
        if(back) {
            back = false;
            navigate(-1);
        }
    }, [back])
    const goBack = () => {
        setBack(true);
    }
    
    return (
        <body>
            <PageHeader/>
            <div className="seller">
                <h1 className="seller_header">Seller Page</h1>
                <div className="seller_main">
                    <h1 className="seller_inventory">Inventory</h1>
                    <button className="seller_add" onClick={GoToAddProduct}>Add Product</button>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div>
                        <ShowSellerProduct userid={userid}/>
                    </div>
                </div>
                <h1 className="sale_title">Sales History</h1>
                <ShowSalesHistory userid={userid} top={top}/>
                <button onClick={goBack} className="back">Back</button>
            </div>
        </body>
    )
}

export default Seller;