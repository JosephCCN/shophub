// Importing Link from react-router-dom to 
// navigate to different end points.
import { Navigate, Link } from "react-router-dom";
import Cookies from 'universal-cookie'

function Actual_home() {
  return (
    <div>
      <p>Actual Home</p>
    </div>
  )
}

function Home(){

  const cookies = new Cookies();
  const userid = cookies.get('userid');
  console.log(userid);
  if(!userid) {
    return (<Navigate to='/login'/>);
  }
  else {
    return(<Actual_home/>);
  }
};
 
export default Home;
