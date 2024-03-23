// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link } from "react-router-dom";
import Cookies from 'universal-cookie'

function Show_Cart() {
  return (
    <div>
      <p>This is the cart.</p>
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
    return(<Show_Cart/>);
  }
};
 
export default Cart;
