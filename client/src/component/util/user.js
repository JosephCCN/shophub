import axios from 'axios'
import { useEffect, useState } from 'react';
import { Router, Navigate, Link, useNavigate } from "react-router-dom";
import './css/user.css'
// this function loads the username from backend server
// input: userid
// output: username page source
export function Username(prop){
    const userid = prop.userid
    const prefix = prop.prefix
    const [isLoading, setLoading] = useState(0);
    const [username, setusername] = useState(0);
    
    //fetch username
    useEffect(() => {
        const fetch_username = async() => {
            try{
                const res = await axios.get(`/user?userid=${userid}`);
                setusername(res.data[0]['username'])
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_username();
    }, [])

    const navigate = useNavigate();
    const [userlink, setUserLink] = useState('')
    useEffect(() => {
        if(!userlink) return;
        navigate(userlink)
    }, [userlink])

    if(isLoading) return <p>Loading...</p>
    else{
        const tmp = `/profile/${userid}`;
        return (<table><tr><td><label>{prefix}</label></td><td><label className="username" type="button" onClick={ () => setUserLink(tmp)} style={{cursor:'pointer'}}>{username}</label></td></tr></table>);
    }
}

export function SellerName(prop){
    const productid = prop.productid;
    const prefix = prop.prefix;
    const [isLoading, setLoading] = useState(0);
    const [username, setusername] = useState('');
    const [userid, setuserid] = useState(0);
    useEffect(() => {
        const fetch_product = async() => {
            try{
                const res = await axios.get(`/product?productid=${productid}`);
                const seller_id = res.data[0]['seller_id']
                const res2 = await axios.get(`/user?userid=${seller_id}`)
                setusername(res2.data[0]['username'])
                setuserid(seller_id)
                setLoading(false);
            }
            catch(err){
                console.log(err);
                return;
            }
        }
        fetch_product();
    })

    const navigate = useNavigate();
    const [userlink, setUserLink] = useState('')
    useEffect(() => {
        if(!userlink) return;
        navigate(userlink)
    }, [userlink])

    if(isLoading) return <p>Loading...</p>;
    const tmp = `/profile/${userid}`;
    return (<table><tr><td><label>{prefix}</label></td><td><label className="username" type="button" onClick={ () => setUserLink(tmp)} style={{cursor:'pointer'}}>{username}</label></td></tr></table>);
}
export default Username;