import './css/edit_profile.css';
import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import PageHeader from '../util/miss'

function EditProfile() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const userid = cookies.get('userid');
    if(!userid) navigate('/login');
    
    const [isLoading, setLoading] = useState(true);
    const [err, setErr] = useState();
    const [originalprofile, setoriginalprofile] = useState([]);
    const [back, setBack] = useState(false);

    const [username, setusername] = useState();
    const [password1, setpassword1] = useState();
    const [password2, setpassword2] = useState();
    const [contact, setcontact] = useState();

    //fetch original profile
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`http://localhost:3030/profile?userid=${userid}`)
            // const L = res.data[0]['password'].length
            // res.data[0]['password'] = Array(L+1).join('*')
            setoriginalprofile(res.data)
            setusername(res.data[0]['username'])
            setLoading(false)
        }
        fetch();
    }, [])

    useEffect(() => {
        if(!back) return;
        navigate(-1);
    }, [back])

    

    const handleeditprofile = async(e) =>{
        try{
            //check edited username and password
            if(password1 != password2) throw('Password not the same!')
            else if(password1 && password1.length > 30) throw('Password length should be less than 30')
            const res = await axios.post('http://localhost:3030/edit_profile', {
                'userid': userid,
                'username': username,
                'password': password1,
                'contact': contact
            });
            if(res.data['username_exist']) setErr('Username already exist');
            else if(Object.keys(password1).length < 8) setErr('Password should be at least 8!')
            else if(Object.keys(username).length > 30) setErr('Username should not be longer than 30!')
            else if(Object.keys(password1).length > 30) setErr('Password should be less than 30!')
            else navigate(-1)
        }
        catch(err){
            setErr(err)
            console.log(err)
        }
    }

    if(isLoading) return <p>Loading...</p>;

    return (
        <body>
            <PageHeader/>
            <h1 className='profile_header'>Edit your profile</h1>
            <p></p>
            <div className='edit_profile'>
                <center>
                <table className='edit_profile_table'>
                    <tr>
                        <td>Username:</td>
                        <td>{originalprofile[0]['username']}</td>
                        <td><input type="text" onChange={(e) => setusername(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Password:</td>
                        <td>{originalprofile[0]['password']}</td>
                        <td><input type="password" onChange={(e) => setpassword1(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Re-enter password:</td>
                        <td></td>
                        <td><input type="password" onChange={(e) => setpassword2(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Contact:</td>
                        <td>{originalprofile[0]['contact']}</td>
                        <td><input type="text" onChange={(e) => setcontact(e.target.value)}/></td>
                    </tr>
                </table>
                </center>
                <button type="submit" onClick={handleeditprofile}>Save</button>
                <button onClick={() => setBack(true)}>Back</button>
            </div>
        </body>
    )

}

export default EditProfile;