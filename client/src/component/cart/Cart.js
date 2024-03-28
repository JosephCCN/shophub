// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link } from "react-router-dom";
import Cookies from 'universal-cookie'
import axios from 'axios'

function Show_Cart(props) {
  const submit = (e) => { //send username and password to backend
    axios.post('http://localhost:3030/login', {
      userid: props.id
    })
    .then(res => {
      if(res.data['err']) {
        setErr(res.data['err'])    //set error msg
        return //cannot retrieve cart, thus return
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  return (
    <div>
      <p>This is the cart of {props.id}.</p>
    </div>
  )
}

function Cart(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  console.log(userid);
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Show_Cart id={userid}/>);
  }
};
 
export default Cart;
