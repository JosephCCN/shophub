import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function Login() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState();
  const navigate = useNavigate();
  let firsterr = 0;
  const cookies = new Cookies();

  const submit = (e) => { //send username and password to backend
    axios.post('http://localhost:3030/login', {
      username: username,
      password: password
    })
    .then(res => {
      if(res.data['err']) {
        setErr(res.data['err'])    //set error msg
        return //cannot login, thus return
      }
      const userid = res.data['user_id'];
      cookies.set('userid', userid, {  //set cookies
        path: '/'
      });
      navigate('/home');  //able to login, then redirect to home page
    })
    .catch(err => {
      console.log(err);
    })
  }

  const reg = (e) => { //called by registration button, rediect to registration page
    navigate('/registration')
  }

  const back = () => {  //check if already login, if so, go back to home page
    const userid = cookies.get('userid');
    if(userid) navigate('/home');
  }

  useEffect(() => {
    back();
  });

  useEffect(() => { //hook for error msg
    setErr('');
  }, [password, username])

    return (
      <div>
        <p>Login page</p>
        <label>Username:</label><input type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br/>
        <label>Password:</label><input type="password" onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <button type="submit" onClick={submit}>Submit</button>
        <button onClick={reg}>Registration</button>
        <br/>
        <p>{err}</p>
      </div>
    );
};
 
export default Login;
