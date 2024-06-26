import './css/profile.css';
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie'
import axios from "axios";
import {ShowOrderHistory, ShowSalesHistory} from '../history/history';
import PageHeader from '../util/miss';
import '../util/css/back.css'

function ProfileInfoSource(infolist){
    var list = []
    const L = Object.keys(infolist).length;
    for(var i=0;i<L;i++){
        const cur = infolist[i];
        list.push(<tr><td>Username:</td> <td>{cur['username']}</td></tr>)
        list.push(<tr><td>Password:</td> <td>{cur['password']}</td></tr>)
        list.push(<tr><td>Contact:</td> <td>{cur['contact']}</td></tr>)
    }
    return <center><table className="profile_table">{list}</table></center>
}

function ShowProfile(prop) {
    const userid = prop.userid
    const [isLoading, setLoading] = useState(true);
    const [err, setErr] = useState();
    const [userinfolist, setuserinfolist] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/profile?userid=${userid}`)
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


function Profile() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    var {profile_userid} = useParams();
    const [isLoading, setisLoading] = useState(true)
    const [isAdmin, setAdmin] = useState(false);
    const [profileAdmin, setProfileAdmin] = useState(false);
    const userid = cookies.get('userid')
    if(!userid) navigate('/login');
    if(!profile_userid) profile_userid = parseInt(userid, 10);

    useEffect(() =>{
        if(cookies.get('admin')) {
            setAdmin(true);
        }
        axios.get(`/admin?userid=${profile_userid}`)
        .then(res => {
            if(res.data['err']) console.log(res.data['err'])
            setProfileAdmin(res.data);
        })
        .catch(err => console.log(err))
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

    const handleDeleteUser = () => {
        axios.get(`/delete_user?userid=${profile_userid}`)
        .then(res => {
            if(res.data['err']) {
                console.log(res.data['err']);
                return;
            }
            navigate(-1);
        })
        .catch(err => console.log(err))
    }
    return (
        <body>
            <PageHeader/>
            <h1 className='profile_header'>Profile</h1>
            <p></p>
            <div className='profile'>
                <ShowProfile userid={profile_userid}/>
                {isAdmin && !profileAdmin ? <button onClick={handleDeleteUser}>Delete User</button> : <></>}
                {(userid == profile_userid || isAdmin) ? <button onClick={() => gotoeditprofile()}>Edit</button> : <></>}
                <h1>Order History:</h1>
            </div>
            <ShowOrderHistory userid={profile_userid} top={top}/>
            <button onClick={goBack} className='back'>Back</button>
        </body>
    )
}

export default Profile;