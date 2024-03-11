import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function Login() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const submit = (e) => {
    axios.post('http://localhost:3030/login', {
      username: username,
      password: password
    })
    .then(res => {
      const userid = res.data['userid'];
      var t = new Date();
      t.setMinutes(t.getMinutes() + 30);
      cookies.set('userid', userid, {
        path: '/login',
        expires: t
      });
      console.log(res)
      //navigate('/home');
    })
    .catch(err => {
      console.log(err);
    })
  }

    return (
      <div>
        <p>Login page</p>
        <label>Username:</label><input type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br/>
        <label>Password:</label><input type="password" onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <button type="submit" onClick={submit}>Submit</button>
      </div>
    );
};
 
export default Login;
