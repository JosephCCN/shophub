import {useState} from 'react'

const Login = () => {

    const [username, setUsername] = useState();

    return (
      <div>
        <p>Login page</p>
        <input type="text" onChange={(e) => setUsername(e.target.value)}/>
        <p>{username}</p>
      </div>
    );
};
 
export default Login;
