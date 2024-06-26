import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useEffect, useState } from "react";
import  { LoadProductPhoto, LoadProduct } from "../util/product";
import "./css/wishlist.css";
import PageHeader from "../util/miss"
import '../util/css/back.css'
import {Username, SellerName} from "../util/user";

function FetchWishlistPageSource(prop){
    const cookies = new Cookies();
    const userid = cookies.get('userid');
    var [removefromlist, setremove] = useState(0);
    const [removed, setRemoved] = useState(0);

    function handleRemove(productid){
        setremove(productid);
    }
    useEffect(() => {
        if(!removefromlist) return;
        const remove_product = async() => {
            try{
                const res = await axios.post('/remove_from_wishlist', {
                    userid: userid,
                    productid: removefromlist
                })
                if(res.data['err']) throw('Cannot remove from wishlist')
                setRemoved(1);
            }
            catch(err){
                console.log(err)
                return;
            }
        }
        remove_product();
    }, [removefromlist])

    const [removeandaddtocart, setremoveadd] = useState(0);
    function handleRemoveandAdd(productid){
        setremoveadd(productid)    
    }
    useEffect(() => {
        if(!removeandaddtocart) return;
        const add_product = async() => {
            try{
                const res = await axios.post('/add_cart', {
                    quantity: 1,    
                    userID: userid,
                    productID: removeandaddtocart
                })
                console.log(userid, removeandaddtocart);
            }
            catch(err){
                console.log(err)
                return;
            }
        }
        add_product();
        handleRemove(removeandaddtocart);
    }, [removeandaddtocart])

    var list = []
    const cur_product = prop.cur_product;
    const cur_product_id = cur_product['product_id']
    list.push(<td><LoadProductPhoto className="product_img" productid={cur_product_id}/></td>) 
    var product_info = [<tr><td><LoadProduct productid={cur_product_id} prefix={['']} entities={['product_name']}/></td></tr>]
    product_info.push(<tr><td><SellerName productid={cur_product_id} prefix={['by ']}/></td></tr>)
    product_info.push(<tr><td><LoadProduct productid={cur_product_id} prefix={['Price: ', 'Stock: ']} entities={['price', 'quantity']}/></td></tr>)
    list.push(<td><table className="wishlist_product_info">{product_info}</table></td>)
    list.push(<td><table><tr><td><button className="wishlist_button" onClick={() => handleRemove(cur_product_id)}>Remove from Wishlist</button></td></tr><tr><td><button className="wishlist_button" onClick={() => handleRemoveandAdd(cur_product_id)}>Remove and Add to Cart</button></td></tr></table></td>)
    const showList = [<table className="product"><tr>{list}</tr></table>, <p></p>]
    const show = showList[removed]
    return(
        <div>
            {show}
        </div>
    )
}

function Wishlist(){
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid')
    if(!userid) navigate('/login');
    const [isLoading, setisLoading] = useState(true);

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

    //check userid
    //fetch wishlist
    const [wishlist, setWishlist] = useState([]);
    useEffect(() => {
        const fetch_wishlist = async() => {
            try{
                const res = await axios.get(`/wishlist?userid=${userid}`)
                const wishlist = res.data
                setWishlist(wishlist)
                setisLoading(false)
                }
            catch(err){
                console.log(err)
                return;
            }
        }
        fetch_wishlist();
    }, [])

    if(isLoading) return <p>Loading...</p>
    const L = Object.keys(wishlist).length;
    var list = []
    if(L === 0){
        list.push(<p style={{'text-align': 'center'}}>Wishlist is empty! Please add product into wishlist</p>)
    }
    for(var i=0;i<L;i++){
        const cur_product = wishlist[i]
        list.push(<tr><td><FetchWishlistPageSource cur_product={cur_product}/></td></tr>)
    }
    const tmp = <center><table>{list}</table></center>
    return (
        <body>
            <PageHeader/>
            <div className="wishlist">
            <h1>Wishlist</h1>
            <div className="wishlist_content">
                {tmp}
            </div>
            <button className="back" onClick={goBack}>Back</button>
            </div>
        </body>
    )

}
export default Wishlist;