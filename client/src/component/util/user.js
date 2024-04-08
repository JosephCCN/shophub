import axios from 'axios'
import { useEffect, useState } from 'react';
import { Router, Navigate, Link, useNavigate } from "react-router-dom";

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
                const res = await axios.get(`http://localhost:3030/user?userid=${userid}`);
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
        return (<p onClick={ () => setUserLink(tmp)} style={{cursor:'pointer'}}>{prefix}{username}</p>);
    }
}

export default Username;