import './css/profile.css';
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import axios from "axios";
import {ShowOrderHistory, ShowSalesHistory} from '../history/history';

function ProfileInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;
    list.push(<tr><td></td><td></td></tr>)
    for(var i=0;i<L;i++){
        const cur = infolist[i];
        list.push(<tr><td>Username:</td> <td>{cur['username']}</td></tr>)
        list.push(<tr><td>Password:</td> <td>{cur['password']}</td></tr>)
        list.push(<tr><td>Contact:</td> <td>{cur['contact']}</td></tr>)
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
            // const L = res.data[0]['password'].length
            // res.data[0]['password'] = Array(L+1).join('*')
            setuserinfolist(res.data)
            setLoading(false)
        }
        fetch();
    }, [])

    if(isLoading) return <p>Loading...</p>;
    else return ProfileInfoSource(userinfolist)
}


function Profile() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    var [userid, setuserid] = useState(0);
    var {profile_userid} = useParams();
    const [isLoading, setisLoading] = useState(true)
    useEffect(() =>{
        const tmp = cookies.get('userid');
        if(!tmp) navigate('/login');
        setuserid(tmp);
        setisLoading(false)
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
    if(!profile_userid) profile_userid = userid

    if(userid == profile_userid){       //viewing own profile
        return (
            <div className='profile'>
                <h1>Profile Page</h1>
                <h2>Profile</h2>
                <ShowProfile userid={userid}/>
                <button onClick={() => gotoeditprofile()}>Edit Profile</button>
                <br/>
                <button onClick={goBack}>Back</button>
                <h1>Order History:</h1>
                <ShowOrderHistory userid={userid} top={top}/>
            </div>
        )
    }
    else{
        return (
            <div>
                <button onClick={goBack}>Back</button>
                <h1>Profile Page</h1>
                <h2>Profile</h2>
                <ShowProfile userid={profile_userid}/>
                <h1>Sales History:</h1>
                <ShowSalesHistory userid={profile_userid} top={top}/>
            </div>
        )
    }
}

export default Profile;