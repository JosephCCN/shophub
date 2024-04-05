import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import {GetUserName, Get, GetProduct} from '../util/util'
import axios from "axios";

function ProfileInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;
    list.push(<tr><td></td><td></td></tr>)
    for(var i=0;i<L;i++){
        const cur = infolist[i];
        list.push(<tr><td>Username:</td> <td>{cur['username']}</td></tr>)
        list.push(<tr><td>Password:</td> <td>{cur['password']}</td></tr>)
    }
    return <center><table>{list}</table></center>
}

function ShowProfile(prop) {
    const userid = prop.userid
    const [isLoading, setLoading] = useState(true);
    const [err, setErr] = useState();
    const [userinfolist, setuserinfolist] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/profile?userid=${userid}`)
            const L = res.data[0]['password'].length
            res.data[0]['password'] = Array(L+1).join('*')
            setuserinfolist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return ProfileInfoSource(userinfolist)
}

function HistoryInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;

    for(var i=0;i<L;i++){
        const cur_order_list = infolist[i];
        const L2 = Object.keys(cur_order_list).length;
        var cur_order_table = []
        //set up column
        cur_order_table.push(<tr><td></td><td>Seller</td><td>Product Name</td><td>Quantity</td><td>Price</td><td>Order Date</td><td></td></tr>)
        for(var j=0;j<L2;j++){
            var cur_product_table = []
            cur_product_table.push(<td><img src={cur_order_list[j]['product_img']}/></td>)
            cur_product_table.push(<td>{cur_order_list[j]['seller_name']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['product_name']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['quantity']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['price']}</td>)
            cur_product_table.push(<td>{cur_order_list[j]['order_date']}</td>)
            cur_product_table.push(cur_order_list[j]['review'])
            cur_order_table.push(<tr>{cur_product_table}</tr>)
        }
        var temp = <center> <table>{cur_order_table}</table> </center>
        list.push(temp)
    }
    return list
}
function ShowOrderHistory(prop) {
    const userid = prop.userid
    const top = prop.top
    const [isLoading, setLoading] = useState(true);
    const [orderlist, setorderlist] = useState([]);

    const navigate = useNavigate();
    var [goreviewpage, setgoreview] = useState(0);
    function gotoreview(path_to_product){
        setgoreview(path_to_product)
    }
    useEffect(() => {
        if(!goreviewpage) return;
        navigate(goreviewpage);
        goreviewpage = 0;
    }, [goreviewpage])

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/orderid?userid=${userid}&top=${top}`)
            const tmp = res.data
            var list = []
            const L = Object.keys(tmp).length;
            for(var i=0;i<L;i++){
                const cur = tmp[i];
                const result = await axios.get(`http://localhost:3030/order?orderid=${cur['order_id']}`)
                var cur_order_list = result.data;
                const L2 = Object.keys(cur_order_list).length;
                for(var j=0;j<L2;j++){
                    //fetch seller username by seller_id
                    const cur_seller_id = cur_order_list[j]['seller_id']
                    const res1 = await axios.get(`http://localhost:3030/user?userid=${cur_seller_id}`)
                    //add to order_list
                    cur_order_list[j]['seller_name'] = res1.data[0]['username']
                    
                    //fetch product_name by product_id
                    const cur_product_id = cur_order_list[j]['product_id']
                    const res2 = await axios.get(`http://localhost:3030/product?id=${cur_product_id}`)
                    //add to order_list
                    cur_order_list[j]['product_name'] = res2.data[0]['product_name']

                    //fetch product_image by product_id
                    const res3 = await axios.get(`http://localhost:3030/product_img?id=${cur_product_id}`, {responseType: 'blob'})
                    var imageUrl = URL.createObjectURL(res3.data);
                    //add image to order_list
                    cur_order_list[j]['product_img'] = imageUrl;

                    //check if there is any review for the specific prodduct
                    const res4 = await axios.get(`http://localhost:3030/review?productid=${cur_product_id}&userid=${userid}`)
                    //add review button to order_list
                    if(!res4.data[0]['exist']) cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)}>Add Review</button></td>;
                    else cur_order_list[j]['review'] = <td><button onClick={() => gotoreview(`/product/${cur_product_id}`)}>Edit Review</button></td>;
                    
                    //add specific product page to order_list
                    cur_order_list[j]['path_to_product'] = `/product/${cur_product_id}`
                }
                list.push(cur_order_list)
            }
            setorderlist(list)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return HistoryInfoSource(orderlist)
}

function Profile() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    const {profile_userid} = useParams();
    useEffect(() =>{
        if(!userid) navigate('/login');
        if(!profile_userid) navigate(`/profile/${userid}`)
    }, [])
    const top = 10
    var [editprofile, seteditprofile] = useState(0);
    function gotoeditprofile(){
        seteditprofile(1);
    }
    useEffect(() =>{
        if(!editprofile) return;
        navigate('/profile/edit_profile');
    }, [editprofile])

    return (
        <div>
            <h1>Profile Page</h1>
            <h2>Profile</h2>
            <button onClick={() => gotoeditprofile()}>Edit Profile</button>
            <ShowProfile userid={userid}/>
            <h1>Order History:</h1>
            <ShowOrderHistory userid={userid} top={top}/>
        </div>
    )
}

export default Profile;