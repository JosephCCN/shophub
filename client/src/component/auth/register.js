import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

function Registration() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [err, setErr] = useState();
  const navigate = useNavigate();
  const cookies = new Cookies();
    

  const submit = (e) => {
    if(password != password2) {
        setPassword('');
        setPassword2('');
        setErr('Password not the same');
        return;
    }
    axios.post('http://localhost:3030/register', {
        username: username,
        password: password
    })
    .then(async(res) => {

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
    setErr('');
    back();
  })

    return (
      <div>
        <p>Registration</p>
        <label>Username:</label><input type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br/>
        <label>Password:</label><input type="password" onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <label>Renter Password:</label><input type="password" onChange={(e) => setPassword2(e.target.value)}/>
        <button type="submit" onClick={submit}>Submit</button>
      </div>
    );
};
 
export default Registration;
