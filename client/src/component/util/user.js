import axios from 'axios'
import { useEffect, useState } from 'react';

// this function loads the username from backend server
// input: userid
// output: username page source
export function Username(prop){
    const userid = prop.userid
    const [isLoading, setLoading] = useState(0);
    const [username, setusername] = useState('');
    
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

    if(isLoading) return <p>Loading...</p>
    else{
        const tmp = `/profile/${username}`;
        return <a href={tmp}>{username}</a>;
    }
}

export default Username;