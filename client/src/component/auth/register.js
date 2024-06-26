import './css/register.css';
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function Reg() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [err, setErr] = useState();
  const navigate = useNavigate();
  const cookies = new Cookies();
    

  const delay = (ms) => {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }

  const submit = (e) => {
    axios.post('/register', {
        username: username,
        password: password
    })
    .then(async(res) => {
      if(res.data['err']) {
        setErr(res.data['err'])    //set error msg
        return //cannot login, thus return
      }
      setErr('Successful! Redicting to login page...');
      await delay(1000);
      navigate('/login');  //able to login, then redirect to home page
    })
    .catch(err => {
        console.log(err);
    })
  }

  const back = () => {
    const userid = cookies.get('userid');
    if(userid) navigate('/home');
  }

  useEffect(() => {
    back();
  })

  useEffect(() => { //hook for error msg
    if(password != password2) {
      setErr('Password not the same')
    }
    else if(password.length > 30) {
      setErr('Password length should less than 30!')
    }
    else if(username.length > 30) {
      setErr('Password length should less than 30!')
    }
    else if(password.length < 8) {
      setErr('Password length at least 8!')
    }
    else {
      setErr('');
    }
  }, [password2, password, username])

    return (
      <body className='register'>
      <br/>
      <p>Shophub</p>
      <div>
        <h1>Registration</h1>
        <label>Username</label>
        <br/>
        <input type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br/>
        <label>Password</label>
        <br/>
        <input type="password" onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <label>Renter Password</label>
        <br/>
        <input type="password" onChange={(e) => setPassword2(e.target.value)}/>
        <br/>
        <button type="submit" onClick={submit}>Submit</button>
        <p>{err}</p>
      </div>
      </body>
    );
};
 
export default Reg;
