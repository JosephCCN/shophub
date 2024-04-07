import { Navigate, Link, useNavigate, useSearchParams, useRevalidator } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useEffect, useState } from "react";
import  { LoadProductPhoto, LoadProduct } from "../util/product";

function WishlistInfoSource(infolist){
    var List = []
    const L = Object.keys(infolist).length;

    if(L === 0){
        return <p>Wishlist is empty! Please add product into wishlist</p>
    }
    for(var i=0;i<L;i++){
        const cur_product_id = infolist[i]['product_id'];
        List.push(<LoadProductPhoto productid={cur_product_id}/>) 
        List.push(<LoadProduct productid={cur_product_id} prefix={['Product Name: ', 'Price: ']} entities={['product_name', 'price']}/>)
        List.push(infolist[i]['remove'])
        List.push(<p>{infolist[i]['msg']}</p>)
    }
    return List
}

function FetchWishlist(prop){
    const userid = prop.userid
    const [isLoading, setisLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    var [removefromlist, setremove] = useState(0);
    const [showproduct, setShowProduct] = useState(true);

    function handleRemove(productid, userid){
        setremove({productid: productid, userid: userid})    
    }
    useEffect(() => {
        if(!removefromlist) return;
        const remove_product = async(productid, userid) => {
            try{
                const res = await axios.post('http://localhost:3030/remove_from_wishlist', {
                    userid: userid,
                    productid: productid
                })
                if(res.data['err']) throw('Cannot remove from wishlist')
                setShowProduct(false)
            }
            catch(err){
                console.log(err)
                return;
            }
        }
        remove_product(removefromlist['productid'], removefromlist['userid']);
    }, [removefromlist])

    useEffect(() => {
        const fetch_wishlist = async() => {
            try{
                const res = await axios.get(`http://localhost:3030/wishlist?userid=${userid}`)
                const wishlist = res.data
                const L = Object.keys(wishlist).length;
                for(var i=0;i<L;i++){
                    const cur_product_id = wishlist[i]['product_id'];
                    wishlist[i]['remove'] = (<button onClick={() => handleRemove(cur_product_id, userid)}>Remove from Wishlist</button>);
                }
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
    else return showproduct && WishlistInfoSource(wishlist)
}
function Wishlist(){
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [userid, setuserid] = useState(0);
    const [isLoading, setisLoading] = useState(true);
    //check userid
    useEffect(() => {
        const tmp = cookies.get('userid')
        if(!tmp) {
            navigate('/login');
        }
        setuserid(tmp)
        setisLoading(false)
    }, [])

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
    if(isLoading) return <p>Loading...</p>
    else{
        return (
            <div>
            <button onClick={goBack}>Back</button>
            <h1>Wishlist</h1>
            <FetchWishlist userid={userid}/>
            </div>
        )
    }

}
export default Wishlist;